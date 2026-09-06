
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situation";

const router = express.Router();

router.get("/situations", (req: Request, res: Response) => {
    res.send('Olá, Mundo! Tela de situações da rota');
});

router.post("/situations", async (req: Request, res: Response) => {
    try {
        var data = req.body;
        const situationRepository = AppDataSource.getRepository(Situation);

        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);
        res.status(201).json({
            message: "Situação cadastrada com sucesso!",
            situation: newSituation
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao cadastrar situação!"
        });
    }
});



export default router;