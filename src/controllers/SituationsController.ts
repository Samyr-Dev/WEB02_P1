
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situation";


const router = express.Router();


//Buscar lista de todas as situações cadastradas no banco de dados
router.get("/situations", async (req: Request, res: Response) => {

    try {
        const situationRepository = AppDataSource.getRepository(Situation);
        const situations = await situationRepository.find();
        res.status(200).json(situations);
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao buscar situações!"

        });
        return;
    }

});


//Buscar a visualização do item cadastrado em situação
router.get("/situations/:id", async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOne({
            where: {
                id: Number(id)
            }});
    
        if (!situation) {
        res.status(404).json({
            message: "Situação não encontrada!"
        });
        return;
    }
    res.status(200).json(situation);
}

    catch (error) {
    res.status(500).json({
        message: "Erro ao listar situações!"
    });
}
});







//Criar a LISTA de situações cadastradas no banco de dados    
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