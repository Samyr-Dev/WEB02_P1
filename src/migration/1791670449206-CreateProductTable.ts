import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1791670449206 implements MigrationInterface {
    name = 'CreateProductTable1791670449206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nameProduct\` varchar(255) NOT NULL, \`description\` text NULL, \`price\` decimal(10,2) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`productCategoryId\` int NULL, \`productSituationId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_5210b3add61b23c9c2d1bbc187d\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_08373177393dc876d7366349774\` FOREIGN KEY (\`productSituationId\`) REFERENCES \`product_situations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_08373177393dc876d7366349774\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_5210b3add61b23c9c2d1bbc187d\``);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
