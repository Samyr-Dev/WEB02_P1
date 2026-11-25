import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { Situation } from "../entity/Situation";
import { ProductCategory } from "../entity/ProductCategory";
import { ProductSituation } from "../entity/ProductSituation";
import { PaginationService } from "../services/PaginationServices";
import * as yup from 'yup';
import slugify from "slugify";
import { Not } from "typeorm";
import { verifyToken } from "../middlewares/authMiddleware";


const router = express.Router();

// Buscar lista de produtos com paginação e relações
router.get("/products", verifyToken, async (req: Request, res: Response) => {
    try {
        const productRepository = AppDataSource.getRepository(Product);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const result = await PaginationService.paginate(productRepository, page, limit, { id: "DESC" }, {productCategory: true, productSituation: true});

        res.status(200).json(result);
        return;
    } catch (error: any) {
        res.status(400).json({
            error: true,
            message: error.message || "Erro ao buscar produtos!"
        });
        return;
    }
});

// Buscar produto por ID (trazendo categoria e situação)
router.get("/products/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productRepository = AppDataSource.getRepository(Product);
        
        const product = await productRepository.findOne({
            where: { id: Number(id) },
            relations: {
                productCategory: true,
                productSituation: true
            }
        });

        if (!product) {
            res.status(404).json({ message: "Produto não encontrado com o ID fornecido!" });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar produto!" });
    }
});

// Cadastrar novo produto
router.post("/products", verifyToken, async (req: Request, res: Response) => {
    try {
        var data = req.body;

        const schema = yup.object().shape({
            nameProduct: yup
            .string()
            .required("O campo 'nameProduct' é obrigatório!")
            .min(3, "O campo 'nameProduct' deve ter no mínimo 3 caracteres!")
            .max(255, "O campo 'nameProduct' deve ter no máximo 255 caracteres!"),

            slug: yup
            .string()
            .required("O campo 'slug' é obrigatório!")
            .min(3, "O campo 'slug' deve ter no mínimo 3 caracteres!")
            .max(255, "O campo 'slug' deve ter no máximo 255 caracteres!"),

            description: yup
            .string()
            .required("O campo 'description' é obrigatório!")
            .min(10, "O campo 'description' deve ter no mínimo 10 caracteres!"),

            price: yup
            .number()
            .typeError("O campo 'price' deve ser um número!")
            .required("O campo 'price' é obrigatório!")
            .positive("O campo 'price' deve ser um número positivo!")
            .test(
                "is-decimal", 
                "O campo 'price' deve ter no máximo 2 casas decimais!", 
                (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")
            ),

            productSituationId: yup
            .number()
            .typeError("O campo 'productSituationId' deve ser um número!")
            .required("O campo 'productSituationId' é obrigatório!")
            .integer("O campo 'productSituationId' deve ser um número inteiro!")
            .positive("O campo 'productSituationId' deve ser um número positivo!"),

            productCategoryId: yup
            .number()
            .typeError("O campo 'productCategoryId' deve ser um número!")
            .required("O campo 'productCategoryId' é obrigatório!")
            .integer("O campo 'productCategoryId' deve ser um número inteiro!")
            .positive("O campo 'productCategoryId' deve ser um número positivo!"),
        });




        // const { nameProduct, description, price, productCategoryId, productSituationId } = req.body;

        // if (!nameProduct || nameProduct.trim() === "") {
        //     res.status(400).json({ message: "O campo 'nameProduct' é obrigatório!" });
        //     return;
        // }

        // if (price === undefined || price === null) {
        //     res.status(400).json({ message: "O campo 'price' é obrigatório!" });
        //     return;
        // }

        // if (!productCategoryId) {
        //     res.status(400).json({ message: "O campo 'productCategoryId' é obrigatório!" });
        //     return;
        // }

        // if (!productSituationId) {
        //     res.status(400).json({ message: "O campo 'productSituationId' é obrigatório!" });
        //     return;
        // }

        await schema.validate(data, { abortEarly: false });

        data.slug = slugify(data.nameProduct, { lower: true, strict: true });

        const productRepo = AppDataSource.getRepository(Product);
        const categoryRepo = AppDataSource.getRepository(ProductCategory);
        const situationRepo = AppDataSource.getRepository(ProductSituation);

        // Validar se a categoria existe
        const categoryExists = await categoryRepo.findOne({ where: { id: Number(data.productCategoryId) } });
        if (!categoryExists) {
            res.status(400).json({ message: "A categoria de produto informada não existe!" });
            return;
        }

        // Validar se a situação do produto existe
        const situationExists = await situationRepo.findOne({ where: { id: Number(data.productSituationId) } });
        if (!situationExists) {
            res.status(400).json({ message: "A situação de produto informada não existe!" });
            return;
        }

        // Verificar se já existe produto com esse nome
        // const existingProduct = await productRepo.findOne({ where: { nameProduct } });
        // if (existingProduct) {
        //     res.status(400).json({
        //         message: "Já existe um produto com esse nome! Atualize-o com o método PUT ou escolha outro nome para o novo produto."
        //     });
        //     return;
        // }

        const existingProduct = await productRepo.findOne({ where: { slug: data.slug } });
        if (existingProduct) {
            res.status(400).json({
                message: "Já existe um produto com esse slug! Atualize-o com o método PUT ou escolha outro nome para o novo produto."
            });
            return;
        }

        const newProduct = productRepo.create({
            ...data,
            productCategory: categoryExists,
            productSituation: situationExists
        });

        await productRepo.save(newProduct);

        res.status(201).json({
            message: "Produto cadastrado com sucesso!",
            product: newProduct
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }
                
        res.status(500).json({ message: "Erro ao cadastrar produto!" });
    }
});

// Atualizar produto
router.put("/products/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data = req.body;
        // const { nameProduct, description, price, productCategoryId, productSituationId } = req.body;

        const schema = yup.object().shape({

            nameProduct: yup
            .string()
            .required("O campo 'nameProduct' é obrigatório!")
            .min(3, "O campo 'nameProduct' deve ter no mínimo 3 caracteres!")
            .max(255, "O campo 'nameProduct' deve ter no máximo 255 caracteres!"),


            slug: yup
            .string()
            .required("O campo 'slug' é obrigatório!")
            .min(3, "O campo 'slug' deve ter no mínimo 3 caracteres!")
            .max(255, "O campo 'slug' deve ter no máximo 255 caracteres!"),

            description: yup
            .string()
            .required("O campo 'description' é obrigatório!")
            .min(10, "O campo 'description' deve ter no mínimo 10 caracteres!"),

            price: yup
            .number()
            .typeError("O campo 'price' deve ser um número!")
            .required("O campo 'price' é obrigatório!")
            .positive("O campo 'price' deve ser um número positivo!")
            .test(
                "is-decimal", 
                "O campo 'price' deve ter no máximo 2 casas decimais!", 
                (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")
            ),

            productSituationId: yup
            .number()
            .typeError("O campo 'productSituationId' deve ser um número!")
            .required("O campo 'productSituationId' é obrigatório!")
            .integer("O campo 'productSituationId' deve ser um número inteiro!")
            .positive("O campo 'productSituationId' deve ser um número positivo!"),

            productCategoryId: yup
            .number()
            .typeError("O campo 'productCategoryId' deve ser um número!")
            .required("O campo 'productCategoryId' é obrigatório!")
            .integer("O campo 'productCategoryId' deve ser um número inteiro!")
            .positive("O campo 'productCategoryId' deve ser um número positivo!"),
        });

        await schema.validate(data, { abortEarly: false });


        const productRepo = AppDataSource.getRepository(Product);
        const product = await productRepo.findOne({ where: { id: Number(id) } });

        if (!product) {
            res.status(404).json({ message: "Produto não encontrado!" });
            return;
        }

        data.slug = slugify(data.nameProduct, { lower: true, strict: true });

        // if (data.nameProduct) {
        //     const existingName = await productRepo.findOne({ where: { nameProduct } });
        //     if (existingName && existingName.id !== Number(id)) {
        //         res.status(400).json({
        //             message: "Já existe outro produto com esse nome! Escolha outro nome."
        //         });
        //         return;
        //     }
        //     product.nameProduct = nameProduct;
        // }

        // if (description !== undefined) product.description = description;
        // if (price !== undefined) product.price = price;

        // if (productCategoryId) {
        //     const categoryRepo = AppDataSource.getRepository(ProductCategory);
        //     const categoryExists = await categoryRepo.findOne({ where: { id: Number(productCategoryId) } });
        //     if (!categoryExists) {
        //         res.status(400).json({ message: "A categoria informada não existe!" });
        //         return;
        //     }
        //     product.productCategory = categoryExists;
        // }

        // if (productSituationId) {
        //     const situationRepo = AppDataSource.getRepository(ProductSituation);
        //     const situationExists = await situationRepo.findOne({ where: { id: Number(productSituationId) } });
        //     if (!situationExists) {
        //         res.status(400).json({ message: "A situação informada não existe!" });
        //         return;
        //     }
        //     product.productSituation = situationExists;
        // }

        const existingProduct = await productRepo.findOne({
            where: {
                slug: data.slug,
                id: Not(Number(id))
            }
        });

        if (existingProduct) {
            res.status(400).json({
                message: "Já existe outro produto com esse slug! Escolha outro nome."
            });
            return;
        }

        productRepo.merge(product, {
            ...data,
            productCategory: { id: Number(data.productCategoryId) },
            productSituation: { id: Number(data.productSituationId) }
        });

        const updatedProduct = await productRepo.save(product);

        res.status(200).json({
            message: "Produto atualizado com sucesso!",
            product: updatedProduct
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        } 
            res.status(500).json({ message: "Erro ao atualizar produto!" });
        
    }
});

// Remover produto
router.delete("/products/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productRepo = AppDataSource.getRepository(Product);
        const product = await productRepo.findOne({ where: { id: Number(id) } });

        if (!product) {
            res.status(404).json({ message: "Produto não encontrado!" });
            return;
        }

        await productRepo.remove(product);

        res.status(200).json({ message: "Produto excluído com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover produto!" });
    }
});

export default router;