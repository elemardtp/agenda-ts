// Nome do arquivo: ./scripts/navigator.ts
// Finalidade: Script para navegação CLI no sistema.
import fetch from 'node-fetch';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    rl.question("Cole o token JWT do login: ", (token) => {
        token = token.trim();
        const base_url = "http://localhost:3000/api";
        const headers = { "Authorization": `Bearer ${token}` };

        function showMenu() {
            console.log("\nMenu de Navegação:");
            console.log("1. Listar Clientes (/api/clientes)");
            console.log("2. Listar Procedimentos (/api/procedimentos)");
            console.log("3. Listar Agendamentos (/api/agendamentos)");
            console.log("4. Sair");
            rl.question("Escolha uma opção: ", handleChoice);
        }

        function handleChoice(choice: string) {
            if (choice === "1") {
                fetch(`${base_url}/clientes`, { headers } as RequestInit)
                    .then(printResponse)
                    .then(showMenu);
            } else if (choice === "2") {
                fetch(`${base_url}/procedimentos`, { headers } as RequestInit)
                    .then(printResponse)
                    .then(showMenu);
            } else if (choice === "3") {
                fetch(`${base_url}/agendamentos`, { headers } as RequestInit)
                    .then(printResponse)
                    .then(showMenu);
            } else if (choice === "4") {
                rl.close();
            } else {
                console.log("Opção inválida!");
                showMenu();
            }
        }

        function printResponse(response) {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json().then(data => {
            console.log("Resposta:", data);
          });
        }

        showMenu();
    });
}

main();
