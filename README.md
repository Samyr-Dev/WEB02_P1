# Projeto WEB02 - P1 e P2

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Sistema desenvolvido para a disciplina de Web 02, focado em uma API REST utilizando Node.js, TypeScript e MySQL. O projeto contempla autenticação JWT, recuperação de senha via e-mail, paginação de resultados e validação de dados com Yup.

## 🛠️ Tecnologias

As seguintes ferramentas são utilizadas no projeto:

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework Web:** Express
- **Banco de Dados:** MySQL
- **ORM:** TypeORM
- **Bibliotecas Principais:** bcryptjs, cors, dotenv, jsonwebtoken, mysql2, nodemailer, slugify, yup

## 📋 Requisitos

- Node.js 22 ou superior
- MySQL 8 ou superior

## 🚀 Como rodar o projeto

1. **Configuração de ambiente:**
   Duplique o arquivo `.env.exemple`, renomeie para `.env` e preencha:
   - as credenciais do banco de dados MySQL (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`);
   - a chave usada para gerar o token de login (`JWT_SECRET`);
   - as configurações do servidor de e-mail SMTP, usadas na recuperação de senha (`EMAIL_FROM`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`).

2. **Instalação de dependências:**
   ```bash
   npm install
   ```

3. **Execução do projeto:**
   Para compilar o TypeScript e executar o servidor com monitoramento de alterações em tempo real:
   ```bash
   npm run start:watch
   ```

## 🗄️ Configuração do Banco de Dados

### Criação do Schema
```sql
CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Migrations
Com o projeto já compilado (passo 3 acima), crie as tabelas (usuários, produtos, categorias e situações) com o comando:
```bash
npx typeorm migration:run -d dist/data-source.js
```

### Seeds
Para popular o banco de dados com registros iniciais de teste (situações e usuários base):
```bash
node dist/run-seeds.js
```

## 🔐 Testando com o Postman

1. Importe a coleção `POSTMAN - API/UNIFAN.postman_collection.json` no Postman.
2. Faça o login na requisição **Autenticação** (o usuário das seeds é `samyr@example.com` com a senha `123456`).
3. Copie o token retornado e cole na variável `token` da coleção. As rotas protegidas usam esse token automaticamente no formato Bearer.

As rotas de login, recuperação de senha, cadastro de novo usuário (`/new-user`) e teste de conexão são públicas. As demais exigem o token.

## 📂 Estrutura de Arquivos

- `.env.exemple`: Modelo de variáveis de ambiente.
- `POSTMAN - API`: Contém a coleção `UNIFAN.postman_collection.json` para testes das rotas.
- `docs`: Relatório final do projeto.
- `src/controllers`: Controladores responsáveis por gerenciar as rotas de autenticação, usuários, situações, produtos e categorias.
- `src/entity`: Definição das entidades do banco de dados (Product, Users, Situation, etc).
- `src/migration`: Scripts de versionamento do banco de dados.
- `src/seeds`: Scripts para inserção de dados iniciais.
- `src/services`: Serviços de autenticação e lógica de paginação.
- `src/middlewares`: Middleware de verificação de token JWT.

## 👤 Autor

**Samyr Tertuliano**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/samyrtertuliano)
