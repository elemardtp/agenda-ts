// Nome do arquivo: ./frontend/tests/compat.test.js
// Finalidade: Testes de compatibilidade do frontend.

import { test, expect } from '@playwright/test';

test('Manutenção de clientes funciona', async ({ browserName, page }: { browserName: string; page: import('@playwright/test').Page }) => {
  await page.goto('http://localhost:3001/login');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'cabelo');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3001/clientes/manutencao');
  await expect(page.locator('h1.br-title')).toHaveText('Manutenção de Clientes');
  await page.click('button.br-button.primary >> text=Adicionar Cliente');
  await expect(page.locator('.br-modal')).toBeVisible();
  console.log(`Teste passou no navegador: ${browserName}`);
});
