import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/ProductSituation";
import { PaginationService } from "../services/PaginationServices";

const router = express.Router();

router.get("/product-situations", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const result = await PaginationService.paginate(repository, page, limit, { id: "DESC" });

        res.status(200).json(result);
        return;
    }
    catch (error: any) {
        res.status(400).json({
            error: true,
            message: error.message || "Erro ao buscar situações de produtos!"
        });
        return;
    }
});

router.get("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repository = AppDataSource.getRepository(ProductSituation);
        const productSituation = await repository.findOne({
            where: { id: Number(id) }
        });

        if (!productSituation) {
            res.status(404).json({
                message: "Situação de produto não encontrada com o ID fornecido!"
            });
            return;
        }
        res.status(200).json(productSituation);
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao listar situação de produto!"
        });
    }
});

router.put("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        var data = req.body;
        const { id } = req.params;
        const { nameProductSituations } = req.body;

        if (!nameProductSituations || nameProductSituations.trim() === "") {
            res.status(400).json({
                message: "O campo 'nameProductSituations' é obrigatório!"
            });
            return;
        }

        const repository = AppDataSource.getRepository(ProductSituation);
        const productSituation = await repository.findOne({
            where: { id: Number(id) }
        });

        if (!productSituation) {
            res.status(404).json({
                message: "Situação de produto não encontrada!"
            });
            return;
        }

        const existing = await repository.findOne({
            where: { nameProductSituations }
        });

        if (existing && existing.id !== Number(id)) {
            res.status(400).json({
                message: "Já existe uma situação com esse nome! Atualize-a com o método PUT ou escolha outro nome para a nova situação."
            });
            return;
        }

        repository.merge(productSituation, data);
        const updated = await repository.save(productSituation);
        res.status(200).json({
            message: "Situação de produto atualizada com sucesso!",
            productSituation: updated
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar situação de produto!"
        });
    }
});

router.delete("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const repository = AppDataSource.getRepository(ProductSituation);
        const productSituation = await repository.findOne({
            where: { id: Number(id) }
        });

        if (!productSituation) {
            res.status(404).json({
                message: "Situação de produto não encontrada!"
            });
            return;
        }

        await repository.remove(productSituation);
        res.status(200).json({
            message: "Situação de produto excluída com sucesso!"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao remover situação de produto!"
        });
    }
});

router.post("/product-situations", async (req: Request, res: Response) => {
    try {
        var data = req.body;
        const { nameProductSituations } = req.body;

        if (!nameProductSituations || nameProductSituations.trim() === "") {
            res.status(400).json({
                message: "O campo 'nameProductSituations' é obrigatório!"
            });
            return;
        }

        const repository = AppDataSource.getRepository(ProductSituation);
        const existing = await repository.findOne({
            where: { nameProductSituations }
        });

        if (existing) {
            res.status(400).json({
                message: "Já existe uma situação com esse nome! Atualize-a com o método PUT ou escolha outro nome para a nova situação."
            });
            return;
        }

        const newProductSituation = repository.create(data);
        await repository.save(newProductSituation);

        res.status(201).json({
            message: "Situação de produto cadastrada com sucesso!",
            productSituation: newProductSituation
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao cadastrar situação de produto!"
        });
    }
});

export default router;