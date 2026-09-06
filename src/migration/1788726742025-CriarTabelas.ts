import { MigrationInterface, QueryRunner } from "typeorm";

export class CriarTabelas1788726742025 implements MigrationInterface {
    name = 'CriarTabelas1788726742025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`situationId\` int NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        
        await queryRunner.query(`CREATE TABLE \`situations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nameSituation\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_nameSituation_unique\` (\`nameSituation\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_c62a4ef5764043d37f9eb344420\` FOREIGN KEY (\`situationId\`) REFERENCES \`situations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_c62a4ef5764043d37f9eb344420\``);
        await queryRunner.query(`DROP INDEX \`IDX_nameSituation_unique\` ON \`situations\``);
        await queryRunner.query(`DROP TABLE \`situations\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}