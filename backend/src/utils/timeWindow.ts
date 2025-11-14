// Nome do arquivo: ./backend/src/utils/timeWindow.ts
// Finalidade: Função para calcular janelas de tempo disponíveis para agendamentos.
interface Agendamento {
  data_hora: string;
  tempo_estimado: number;
}

interface TimeWindow {
  start: string;
  end: string;
}

const calculateTimeWindows = (startDate: Date, totalDuration: number, existingAgendamentos: Agendamento[]): TimeWindow[] => {
  const windows: TimeWindow[] = [];
  const start = new Date(startDate.setHours(8, 0, 0, 0)); // 8 AM
  const end = new Date(startDate.setHours(18, 0, 0, 0)); // 6 PM
  let current = new Date(start);

  while (current < end) {
    const windowEnd = new Date(current.getTime() + totalDuration * 60 * 1000);
    if (windowEnd > end) break;

    const isOccupied = existingAgendamentos.some(a => {
      const aStart = new Date(a.data_hora);
      const aEnd = new Date(aStart.getTime() + a.tempo_estimado * 60 * 1000);
      return current < aEnd && windowEnd > aStart;
    });

    if (!isOccupied) {
      windows.push({ start: current.toISOString(), end: windowEnd.toISOString() });
    }
    current = new Date(current.getTime() + 30 * 60 * 1000); // 30-minute increments
  }
  return windows;
};

export { calculateTimeWindows };
