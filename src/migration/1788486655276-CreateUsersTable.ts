import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUsersTable1788486655276 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "nameUser",
                    type: "varchar"
                },
                {
                    name: "emailUser",
                    type: "varchar",
                    isUnique: true
                },
                {
                    name: "situationId",
                    type: "int"
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));

        //CRIAR CHAVE ESTRANGEIRA PARA A TABELA SITUATIONS

        await queryRunner.createForeignKey("users", new TableForeignKey({
            columnNames: ["situationId"],
            referencedColumnNames: ["id"],
            referencedTableName: "situations",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //REMOVER A CHAVE ESTRANGEIRA ANTES DE REMOVER A TABELA
        const table = await queryRunner.getTable("users");
        const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.includes("situationId"));
        if (foreignKey) {
            await queryRunner.dropForeignKey("users", foreignKey);
        }

        await queryRunner.dropTable("users");
    }

}
