import { AppDataSource } from "./data-source"
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds"
import CreateUsersSeeds from "./seeds/CreateUsersSeeds"

const runSeeds = async () => {
    console.log("Iniciando o processo de execução dos seeds...")

    await AppDataSource.initialize();
    console.log("Conexão com o banco de dados estabelecida com sucesso.")

    try {

        //cria a instância da classe CreateSituationsSeeds e chama o método run
        const situationSeed = new CreateSituationsSeeds();
        const userSeed = new CreateUsersSeeds();
        //executa o seed para a tabela 'situations'
        await situationSeed.run(AppDataSource);
        await userSeed.run(AppDataSource);

    } catch (error) { 

        console.error("Ocorreu um erro durante a execução dos seeds:", error)
    }
    finally {
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")
    }
};

runSeeds();