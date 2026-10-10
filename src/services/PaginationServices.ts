import { Repository, ObjectLiteral, FindOptionsOrder } from "typeorm";


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
        order: FindOptionsOrder<T> = {}
    ): Promise<PaginationResult<T>> {

        const totalRecords = await repository.count();

        if (totalRecords === 0) {
            //Se não houver registros, lança um erro
            throw new Error("Nenhum registro encontrado!");
        }


        const lastPage = Math.ceil(totalRecords / limit);

        if (page < 1 || limit < 1) {
            //Se a página for menor que 1 ou se o limite for menor que 1, lança um erro
            throw new Error("Parâmetros de paginação inválidos! Digite um número maior que 0 para a página e para o limite.");
        }

        else if (page > lastPage) {
            //Se a página solicitada for maior que a última página disponível, lança um erro
            throw new Error(`A página solicitada não existe! O total de páginas disponíveis é: ${lastPage}`);
        }


 

        const offset = (page - 1) * limit;

        const data = await repository.find({
            take: limit,
            skip: offset,
            order: order
        });

        return {
            error: false,
            data: data,
            currentPage: page,
            lastPage: lastPage,
            totalRecords: totalRecords
        };

    }
}