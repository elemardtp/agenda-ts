# Nome do arquivo: ./backend/Dockerfile
# Finalidade: Dockerfile para o backend (agora compatível com TS).
FROM node:20

# Install ca-certificates and build dependencies
RUN echo "deb http://deb.debian.org/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb http://deb.debian.org/debian-security bookworm-security main" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y ca-certificates python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy Zscaler root CA as .crt (opcional: remova se não usar proxy corporativo)
COPY zscaler-root-ca.crt /usr/local/share/ca-certificates/zscaler-root-ca.crt

# Update system trust store
RUN update-ca-certificates

# Set persistent ENV for Node.js to use the updated cert bundle
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

# Debug: Verify certificate is added and test HTTPS connectivity
RUN cat /etc/ssl/certs/ca-certificates.crt | grep -i zscaler || echo "Zscaler cert not found in bundle" && \
    curl -v https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz -o /tmp/test.tgz || echo "Curl HTTPS failed" && \
    node -e "require('https').get('https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz', res => console.log('Node HTTPS success'))" || echo "Node HTTPS failed" && \
    node -e "require('https').get('https://nodejs.org/download/release/v20.17.0/node-v20.17.0-headers.tar.gz', res => console.log('Node headers download test success'))" || echo "Node headers HTTPS failed"

WORKDIR /agendamento-ts

COPY package*.json ./

# Instala dependências (inclui typescript e tipos para TS)
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set strict-ssl true && \
    npm cache clean --force && \
    npm install --loglevel=verbose && \
    npm install -D typescript @types/node @types/express @types/pg @types/jsonwebtoken @types/bcrypt @types/cors @types/multer && \
    npm list dotenv || { echo "Erro: dotenv não instalado"; cat /root/.npm/_logs/*.log; exit 1; } && \
    ls -la node_modules/dotenv && \
    echo "npm install completed successfully"

# Copia arquivos da aplicação (inclui .ts agora)
COPY ./middleware /agendamento-ts/middleware
COPY ./src /agendamento-ts/src
COPY ./init-scripts /agendamento-ts/init-scripts
COPY tsconfig.json ./

# Build TS para JS (transpila para dist/)
RUN npx tsc --build tsconfig.json

# Debug: Verify files (agora verifica .ts ou .js em dist)
RUN ls -l /agendamento-ts/src/utils/ || echo "Directory src/utils/ not found" && \
    ls -l /agendamento-ts/dist/utils/errorHandler.js || echo "errorHandler.js not found in dist"

# Create uploads directory
RUN mkdir -p uploads && chmod -R 777 uploads

EXPOSE 3000

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/zscaler-root-ca.crt

# CMD roda o JS compilado
CMD ["node", "dist/server.js"]
