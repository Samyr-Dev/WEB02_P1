import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategory";
import { PaginationService } from "../services/PaginationServices";

const router = express.Router();

// Buscar lista de todas as categorias cadastradas no banco de dados com paginação
router.get("/product-categories", async (req: Request, res: Response) => {
    try {
        const categoryRepository = AppDataSource.getRepository(ProductCategory);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const result = await PaginationService.paginate(categoryRepository, page, limit, { id: "DESC" });

        res.status(200).json(result);
        return;
    }
    catch (error: any) {
        res.status(400).json({
            error: true,
            message: error.message || "Erro ao buscar categorias!"
        });
        return;
    }
});

// Buscar a visualização do item cadastrado em categoria por ID
router.get("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const categoryRepository = AppDataSource.getRepository(ProductCategory);
        const category = await categoryRepository.findOne({
            where: {
                id: Number(id)
            }
        });

        if (!category) {
            res.status(404).json({
                message: "Categoria não encontrada com o ID fornecido!"
            });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao listar categorias!"
        });
    }
});

// Alterar a visualização do item cadastrado em categoria
router.put("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        var data = req.body;
        const { id } = req.params;
        const { nameProductCategories } = req.body;

        if (nameProductCategories === "" || nameProductCategories === undefined || nameProductCategories === null || nameProductCategories.trim() === "" || nameProductCategories.length === 0 || !nameProductCategories) {
            res.status(400).json({
                message: "O campo 'nameProductCategories' é obrigatório!"
            });
            return;
        }

        const categoryRepository = AppDataSource.getRepository(ProductCategory);

        const category = await categoryRepository.findOne({
            where: {
                id: Number(id)
            }
        });

        if (!category) {
            res.status(404).json({
                message: "Categoria não encontrada!"
            });
            return;
        }

        const existingCategory = await categoryRepository.findOne({
            where: { nameProductCategories }
        });

        if (existingCategory && existingCategory.id !== Number(id)) {
            res.status(400).json({
                message: "Já existe uma categoria com esse nome!"
            });
            return;
        }

        // Atualiza os dados
        categoryRepository.merge(category, data);
        const updateCategory = await categoryRepository.save(category);
        res.status(200).json({
            message: "Categoria atualizada com sucesso!",
            category: updateCategory
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar categoria!"
        });
    }
});

// Remover a visualização do item cadastrado em categoria
router.delete("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const categoryRepository = AppDataSource.getRepository(ProductCategory);

        const category = await categoryRepository.findOne({
            where: {
                id: Number(id)
            }
        });

        if (!category) {
            res.status(404).json({
                message: "Categoria não encontrada!"
            });
            return;
        }

        // Remover os dados
        await categoryRepository.remove(category);
        res.status(200).json({
            message: "Categoria excluída com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao remover categoria!"
        });
    }
});

// Criar a categoria cadastrada no banco de dados    
router.post("/product-categories", async (req: Request, res: Response) => {
    try {
        var data = req.body;
        const { nameProductCategories } = req.body;

        if (nameProductCategories === "" || nameProductCategories === undefined || nameProductCategories === null || nameProductCategories.trim() === "" || nameProductCategories.length === 0 || !nameProductCategories) {
            res.status(400).json({
                message: "O campo 'nameProductCategories' é obrigatório!"
            });
            return;
        }

        const categoryRepository = AppDataSource.getRepository(ProductCategory);

        const existingCategory = await categoryRepository.findOne({
            where: { nameProductCategories }
        });

        if (existingCategory) {
            res.status(400).json({
                message: "Já existe uma categoria com esse nome! Atualize-a com o método PUT ou escolha outro nome para a nova categoria."
            });
            return;
        }

        else {
            const newCategory = categoryRepository.create(data);

            await categoryRepository.save(newCategory);

            res.status(201).json({
                message: "Categoria cadastrada com sucesso!",
                category: newCategory
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao cadastrar categoria!"
        });
    }
});

export default router;