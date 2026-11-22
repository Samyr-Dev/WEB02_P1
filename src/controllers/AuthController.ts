import { AuthServices } from "../services/AuthServices";
import express, { Request, Response } from "express";
import * as yup from 'yup';
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import crypto from "crypto";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Email e senha são obrigatórios",
            });
            return;
        }

        const authServices = new AuthServices();

        const userData = await authServices.login(email, password);

        res.status(200).json({
            message: "Login realizado com sucesso",
            user: userData
        });
        return;

    }
    catch (error: any) {
        res.status(401).json({
            message: error.message || "Erro ao realizar login"
        });
        return;
    }
});


router.post("/recover-password", async (req: Request, res: Response) => {

    try {

        var data = req.body;

        const schema = yup.object().shape({
            urlRecoverPassword: yup.string().required("O campo 'urlRecoverPassword' é obrigatório"),
            email: yup.string().email("Email inválido").required("O campo 'email' é obrigatório"),
        });

        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(Users);

        const user = await userRepository.findOneBy({

            email: data.email

        });

        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado"
            });
            return;
        }

        user.recoverPassword = crypto.randomBytes(32).toString("hex");

        await userRepository.save(user);

        res.status(200).json({
            message: "Gerado o link para recuperar a senha.",
            urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
            key: user.recoverPassword

        })



    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        res.status(500).json({
            message: "Erro ao recuperar senha"
        });
    }
});

export default router;