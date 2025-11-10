# Frontend Dockerfile para Skedia Chat
FROM node:18-alpine AS builder

# Diretório de trabalho
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# ARG para receber variável de ambiente durante o build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build da aplicação
RUN npm run build

# Stage 2: Servir com nginx
FROM nginx:alpine

# Copiar build para nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]
