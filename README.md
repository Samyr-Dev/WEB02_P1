# WEB02_P1

[![License](https://img.shields.io/badge/License-ISC-blue.svg)](./LICENSE)

Sistema em desenvolvimento para a matéria de Web 02, utilizando Node.js e TypeScript, além de MySQL como banco de dados.

## 🛠️ Tecnologias

As seguintes ferramentas são utilizadas no projeto:

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework Web:** Express
- **Banco de Dados:** MySQL
- **ORM:** TypeORM
- **Drivers e Utilitários:** mysql2, dotenv, reflect-metadata, concurrently, ts-node

## 📋 Requisitos

* Node.js 22 ou superior
* MySQL 8 ou superior

## 🚀 Como rodar o projeto

1. **Configuração de ambiente:**
   Duplique o arquivo `.env.exemple` e renomeie para `.env`. Altere as credenciais do banco de dados conforme sua configuração local.

2. **Instalação de dependências:**
   ```bash
   npm install
   ```

3. **Execução do projeto:**
   Para compilar o TypeScript e executar o servidor com monitoramento de alterações:
   ```bash
   npm run start:watch
   ```

## 🗄️ Configuração do Banco de Dados

### Criação do Schema
```sql
CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Migrations
Para criar as tabelas no banco de dados, utilize o comando:
```bash
npx typeorm migration:run -d dist/data-source.js
```

### Seeds
Para cadastrar registros de teste nas tabelas:
```bash
node dist/run-seeds.js
```

## 📂 Estrutura de Arquivos

- `.env.exemple`: Modelo de variáveis de ambiente.
- `dist`: Arquivos compilados (JavaScript).
- `src`: Código-fonte em TypeScript.
- `tsconfig.json`: Configurações do compilador TypeScript.
- `package.json`: Gerenciamento de dependências e scripts.

## 👤 Autor

**Samyr Tertuliano**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/samyrtertuliano)
