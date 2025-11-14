// Nome do arquivo: ./backend/src/features/agendamentos/services/agendamentoService.ts
// Finalidade: Serviço para operações de agendamentos.
import AgendamentoModel from '../models/agendamentoModel';
import ProcedimentoModel from '../../procedimentos/models/procedimentoModel';
import ClienteModel from '../../clientes/models/clienteModel';
import { AppError } from '../../../utils/errorHandler';
import { calculateTimeWindows } from '../../../utils/timeWindow';

interface Agendamento {
  id: number;
  cliente_cpf: string;
  procedimento_id: number;
  data_hora: Date;
  created_at: Date;
  tempo_estimado?: number;
}

interface TimeWindow {
  start: string;
  end: string;
}

const getAllAgendamentos = async (): Promise<Agendamento[]> => {
  const agendamentos = await AgendamentoModel.getAll();
  return agendamentos;
};

const getAvailableTimeWindows = async (data: Date, procedimentoIds: number[]): Promise<TimeWindow[]> => {
  const procedimentos = await Promise.all(
    procedimentoIds.map(async (id) => await ProcedimentoModel.getById(id))
  );
  const totalDuration = procedimentos.reduce((sum, p) => sum + p.tempo_estimado, 0);
  const agendamentos = await AgendamentoModel.getTimeWindows(data, procedimentoIds);
  const timeWindows = calculateTimeWindows(data, totalDuration, agendamentos);
  return timeWindows;
};

const createAgendamento = async (clienteCpf: string, procedimentoIds: number[], dataHora: Date): Promise<Agendamento> => {
  const cliente = await ClienteModel.getByCpf(clienteCpf);
  if (!cliente) {
    throw new AppError('Cliente não encontrado', 404);
  }
  const procedimentos = await Promise.all(
    procedimentoIds.map(async (id) => await ProcedimentoModel.getById(id))
  );
  if (procedimentos.some(p => !p)) {
    throw new AppError('Um ou mais procedimentos não encontrados', 404);
  }
  const totalDuration = procedimentos.reduce((sum, p) => sum + p.tempo_estimado, 0);
  const agendamentos = await AgendamentoModel.getTimeWindows(dataHora, procedimentoIds);
  const isOccupied = agendamentos.some(a => {
    const aStart = new Date(a.data_hora);
    const aEnd = new Date(aStart.getTime() + (a.tempo_estimado || 0) * 60 * 1000);
    const requestedStart = new Date(dataHora);
    const requestedEnd = new Date(requestedStart.getTime() + totalDuration * 60 * 1000);
    return requestedStart < aEnd && requestedEnd > aStart;
  });
  if (isOccupied) {
    throw new AppError('Horário já ocupado', 409);
  }
  const agendamento = await AgendamentoModel.create(clienteCpf, procedimentoIds[0], dataHora);
  return agendamento;
};

const deleteAgendamento = async (id: number): Promise<boolean> => {
  const result = await AgendamentoModel.delete(id);
  if (!result) {
    throw new AppError('Agendamento não encontrado', 404);
  }
  return result;
};

export { getAllAgendamentos, getAvailableTimeWindows, createAgendamento, deleteAgendamento };
