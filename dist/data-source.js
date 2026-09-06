"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const Situation_1 = require("./entity/Situation");
const Users_1 = require("./entity/Users");
dotenv_1.default.config();
const dialect = (_a = process.env.DB_DIALECT) !== null && _a !== void 0 ? _a : "mysql";
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situation_1.Situation, Users_1.Users],
    migrations: [__dirname + "/migration/*.{ts,js}"],
});
exports.AppDataSource.initialize().then(() => {
    console.log("Data Source iniciou com sucesso!");
}).catch((error) => {
    console.error("Error na conexão com o banco de dados", error);
});
