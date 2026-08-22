
import express from "express";

import dotenv from "dotenv";
dotenv.config();

const app = express();

import loginRouter from "./controllers/login";

import { AppDataSource } from "./data-source";

app.use("/", loginRouter);

AppDataSource.initialize().then(() => {
    console.log("Data Source iniciou com sucesso!");
}).catch((error) => {
    console.error("Error na conexão com o banco de dados", error);
});

app.listen(process.env.PORT, () => {
    console.log(`Acesse: http://localhost:${process.env.PORT}`);
});