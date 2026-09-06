
import { DataSource } from "typeorm";
import "reflect-metadata";
import dotenv from "dotenv";
import { Situation } from "./entity/Situation";
import { Users } from "./entity/Users";

dotenv.config();

const dialect = process.env.DB_DIALECT ?? "mysql";

export const AppDataSource = new DataSource({
    type: (process.env.DB_DIALECT as any) || "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situation, Users],
    migrations: [ __dirname + "/migration/*.{ts,js}"],
})

AppDataSource.initialize().then(() => {
    console.log("Data Source iniciou com sucesso!");
}).catch((error) => {
    console.error("Error na conexão com o banco de dados", error);
})
