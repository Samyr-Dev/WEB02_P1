"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const login_1 = __importDefault(require("./controllers/login"));
const data_source_1 = require("./data-source");
app.use("/", login_1.default);
data_source_1.AppDataSource.initialize().then(() => {
    console.log("Data Source iniciou com sucesso!");
}).catch((error) => {
    console.error("Error na conexão com o banco de dados", error);
});
app.listen(process.env.PORT, () => {
    console.log(`Acesse: http://localhost:${process.env.PORT}`);
});
