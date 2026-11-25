import { MigrationInterface, QueryRunner } from "typeorm";

// Cria as tabelas que as outras migrations usam como chave estrangeira (situations, product_categories e product_situations).
// Usa IF NOT EXISTS para não dar erro no banco que já tem essas tabelas criadas nas primeiras aulas.
export class CreateBaseTables1791669361116 implements MigrationInterface {
    name = 'CreateBaseTables1791669361116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`situations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nameSituation\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_situations_nameSituation\` (\`nameSituation\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`product_categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nameProductCategories\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_product_categories_name\` (\`nameProductCategories\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`product_situations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nameProductSituations\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_product_situations_name\` (\`nameProductSituations\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`product_situations\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`product_categories\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`situations\``);
    }

}
