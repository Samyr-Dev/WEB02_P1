import { Users } from "../entity/Users";
import { AppDataSource } from "../data-source";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AuthServices {

    private userRepository = AppDataSource.getRepository(Users);

    /**
     * @param email - E-mail do usuário
     * @param password - Senha do usuário
     * @returns Dados do usuário autenticado
     * @throws Erro caso as credenciais estejam incorretas ou o usuário não exista
     */

    async login (email: string, password: string): Promise<{
        id: number;
        name: string;
        email: string;
        token: string;
    }> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error("Usuário ou senha inválidos");
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error("Usuário ou senha inválidos");
        }

        const token = jwt.sign({id: user.id }, 
             process.env.JWT_SECRET as string, { expiresIn: "7d" });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token
        };
    }
    
}