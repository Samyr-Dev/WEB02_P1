import { AuthServices } from "../services/AuthServices";
import express, { Request, Response } from "express";

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


export default router;