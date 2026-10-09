import {DataSource} from "typeorm"
import {Situation} from "../entity/Situation"

export default class CreateSituationsSeeds {

    public async run  (dataSource: DataSource): Promise<void> {

        console.log("Iniciando o seed para a tabela 'situations'...")

        const situationRepository = dataSource.getRepository(Situation)

        const existingSituations = await situationRepository.count()
        if (existingSituations > 0) {
            console.log("A tabela 'situations' já possui registros. Nenhuma alteração foi feita.")
            return
        }

        const situations = [
            { nameSituation: "Situacao 1" },
            { nameSituation: "Situacao 2" },
            { nameSituation: "Situacao 3" }
        ]

        await situationRepository.save(situations)

        console.log("Seed para a tabela 'situations' concluído com sucesso.")
    }
}