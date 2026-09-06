
import express from "express";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";


import { AppDataSource } from "./data-source";

app.use("/", AuthController);
app.use("/", SituationsController);

app.listen(process.env.PORT, () => {
    console.log(`Acesse: http://localhost:${process.env.PORT}`);
});