import {DataSource} from "typeorm";

import { Users } from "../entity/Users";
import { Situation } from "../entity/Situation";
import bcrypt from "bcryptjs";

export default class CreateUsersSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a execução das seeds de usuários...");

        const userRepository = dataSource.getRepository(Users);
        const situationRepository = dataSource.getRepository(Situation);

        const existingCount = await userRepository.count();
        if (existingCount > 0) {
            console.log("Usuários já existem no banco de dados. Pulando a execução das seeds.");
            return;
        }

        const situation = await situationRepository.findOneBy({ id: 1 });
        if (!situation) {
            console.error("Situação com ID 1 não encontrada. Certifique-se de que as seeds de situações foram executadas corretamente.");
            return;
        }

        const users = [
            {
                id: 1,
                name: "Samyr",
                email: "samyr@example.com",
                password: await bcrypt.hash("123456", 10),
                situation: situation,
            },
            {
                id: 2,
                name: "João",
                email: "joao@example.com",
                password: await bcrypt.hash("123456", 10),
                situation: situation,
            }
        ];

        await userRepository.save(users);
        console.log("Seeds de usuários executadas com sucesso.");
    }
}
