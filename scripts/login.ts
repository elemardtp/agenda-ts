// Nome do arquivo: ./scripts/login.ts
// Finalidade: Script para testar login.
import fetch from 'node-fetch';

const url = "http://172.24.201.122:3000/api/funcionarios/login";
const payload = {
  "username": "admin",
  "password": "qdseasdc"
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
}).then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}).then(data => {
  console.log("Login bem-sucedido!");
  console.log("Token:", data.token);
}).catch(e => {
  console.log("Erro no login:", e);
});
