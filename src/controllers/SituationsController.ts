
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situation";
import { PaginationService } from "../services/PaginationServices";


const router = express.Router();


//Buscar lista de todas as situações cadastradas no banco de dados
router.get("/situations", async (req: Request, res: Response) => {

    try {
        const situationRepository = AppDataSource.getRepository(Situation);

        const page = Number(req.query.page) || 1;

        //Define o limite de itens por página, se não for definido fica 5. 
        const limit = Number(req.query.limit) || 5;

        


        const result = await PaginationService.paginate(situationRepository, page, limit, { id: "DESC" });

        res.status(200).json(result);
        return;

    }
    catch (error : any) {
        res.status(400).json({
            error: true,
            message: error.message || "Erro ao buscar situações!"

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
            }
        });

        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada com o ID fornecido!"
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



//Alterar a visualização do item cadastrado em situação
router.put("/situations/:id", async (req: Request, res: Response) => {
    try {

        var data = req.body;

        const { id } = req.params;

        const { nameSituation } = req.body;


        if (nameSituation === "" || nameSituation === undefined || nameSituation === null || nameSituation.trim() === "" || nameSituation.length === 0 || !nameSituation) {
            res.status(400).json({
                message: "O campo 'nameSituation' é obrigatório!"
            });
            return;
        }

        const situationRepository = AppDataSource.getRepository(Situation);


        const situation = await situationRepository.findOne({
            where: {
                id: Number(id)
            }
        });

        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada!"
            });
            return;
        }




        const existingSituation = await situationRepository.findOne({
            where: { nameSituation }
        });

        if (existingSituation && existingSituation.id !== Number(id)) {
            res.status(400).json({
                message: "Já existe uma situação com esse nome!"
            });
            return;
        }






        //atualiza os dados
        situationRepository.merge(situation, data);
        const updateSituation = await situationRepository.save(situation);
        res.status(200).json({
            message: "Situação atualizada com sucesso!",
            situation: updateSituation
        });
    }

    catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar situações!"
        });
    }
});




//Remover a visualização do item cadastrado em situação
router.delete("/situations/:id", async (req: Request, res: Response) => {
    try {

        const { id } = req.params;


        const situationRepository = AppDataSource.getRepository(Situation);


        const situation = await situationRepository.findOne({
            where: {
                id: Number(id)
            }
        });

        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada!"
            });
            return;
        }



        //Remover os dados
        await situationRepository.remove(situation);
        res.status(200).json({
            message: "Situação excluída com sucesso!",
        });
    }

    catch (error) {
        res.status(500).json({
            message: "Erro ao remover situações!"
        });
    }
});



//Criar a LISTA de situações cadastradas no banco de dados    
router.post("/situations", async (req: Request, res: Response) => {
    try {
        var data = req.body;


        const { nameSituation } = req.body;

        if (nameSituation === "" || nameSituation === undefined || nameSituation === null || nameSituation.trim() === "" || nameSituation.length === 0 || !nameSituation) {
            res.status(400).json({
                message: "O campo 'nameSituation' é obrigatório!"
            });
            return;
        }

        const situationRepository = AppDataSource.getRepository(Situation);

        const existingSituation = await situationRepository.findOne({
            where: { nameSituation }
        });

        if (existingSituation) {
            res.status(400).json({
                message: "Já existe uma situação com esse nome!"
            });
            return;
        }

        else {
            const newSituation = situationRepository.create(data);

            await situationRepository.save(newSituation);

            res.status(201).json({
                message: "Situação cadastrada com sucesso!",
                situation: newSituation
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao cadastrar situação!"
        });
    }
});



export default router;