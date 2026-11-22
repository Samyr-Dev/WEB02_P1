import {DataSource} from "typeorm";

import { Product } from "../entity/Product";
import { ProductSituation } from "../entity/ProductSituation";
import { ProductCategory } from "../entity/ProductCategory";

export default class CreateProductsSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando a execução das seeds de produtos...");

        const productRepository = dataSource.getRepository(Product);
        const productSituationRepository = dataSource.getRepository(ProductSituation);
        const productCategoryRepository = dataSource.getRepository(ProductCategory);

        const existingCount = await productRepository.count();
        if (existingCount > 0) {
            console.log("Produtos já existem no banco de dados. Pulando a execução das seeds.");
            return;
        }

        const situation = await productSituationRepository.findOneBy({ id: 1 });
        
        if (!situation) {
            console.error("Situação com ID 1 não encontrada. Certifique-se de que as seeds de situações foram executadas corretamente.");
            return;
        }
        const category = await productCategoryRepository.findOneBy({ id: 1 });
        if (!category) {
            console.error("Categoria com ID 1 não encontrada. Certifique-se de que as seeds de categorias foram executadas corretamente.");
            return;
        }

        const products = [
            Object.assign(new Product(), {
                id: 1,
                nameProduct: "Produto 1",
                slug: "produto-1",
                description: "Descrição do Produto 1",
                price: 19.99,
                situation: situation,
                category: category
            }),
            Object.assign(new Product(), {
                id: 2,
                nameProduct: "Produto 2",
                slug: "produto-2",
                description: "Descrição do Produto 2",
                price: 29.99,
                situation: situation,
                category: category
            }),
            Object.assign(new Product(), {
                id: 3,
                nameProduct: "Produto 3",
                slug: "produto-3",
                description: "Descrição do Produto 3",
                price: 39.99,
                situation: situation,
                category: category
            })
        ];

        await productRepository.save(products);
        console.log("Seeds de produtos executadas com sucesso.");
    }
}

