
import express from "express";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import ProductCategoryController from "./controllers/ProductCategoryController";
import ProductSituationController from "./controllers/ProductSituationController";
import UsersController from "./controllers/UsersController";
import ProductController from "./controllers/ProductController";


import { AppDataSource } from "./data-source";

app.use("/", AuthController);
app.use("/", ProductCategoryController);
app.use("/", SituationsController);
app.use("/", ProductSituationController);
app.use("/", UsersController);
app.use("/", ProductController);

app.listen(process.env.PORT, () => {
    console.log(`Acesse: http://localhost:${process.env.PORT}`);
});