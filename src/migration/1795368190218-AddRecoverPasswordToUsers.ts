import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRecoverPasswordToUsers1795368190218 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'recoverPassword',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
        }));
        await queryRunner.query(`ALTER TABLE users MODIFY COLUMN recoverPassword VARCHAR(255) AFTER password`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'recoverPassword');
    }



}
