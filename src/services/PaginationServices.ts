import { Repository, ObjectLiteral, FindOptionsOrder, FindManyOptions } from "typeorm";

interface PaginationResult<T> {
    error: boolean;
    data: T[];
    currentPage: number;
    lastPage: number;
    totalRecords: number;
}

export class PaginationService {
    static async paginate<T extends ObjectLiteral>(
        repository: Repository<T>,
        page: number = 1,
        limit: number = 10,
        order: FindOptionsOrder<T> = {},
        relations?: FindManyOptions<T>["relations"],
    ): Promise<PaginationResult<T>> {

        const totalRecords = await repository.count();

        if (totalRecords === 0) {
            throw new Error("Nenhum registro encontrado!");
        }

        const lastPage = Math.ceil(totalRecords / limit);

        if (page < 1 || limit < 1) {
            throw new Error("Parâmetros de paginação inválidos! Digite um número maior que 0 para a página e para o limite.");
        } else if (page > lastPage) {
            throw new Error(`A página solicitada não existe! O total de páginas disponíveis é: ${lastPage}`);
        }

        const offset = (page - 1) * limit;

        const data = await repository.find({
            take: limit,
            skip: offset,
            order,
            ...(relations ? { relations } : {}),
        });

        return {
            error: false,
            data,
            currentPage: page,
            lastPage,
            totalRecords,
        };
    }
}