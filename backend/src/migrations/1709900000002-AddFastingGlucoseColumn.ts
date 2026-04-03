import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFastingGlucoseColumn1709900000002 implements MigrationInterface {
    name = 'AddFastingGlucoseColumn1709900000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE predictions 
            ADD COLUMN fastingGlucose DECIMAL(10,2) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE predictions 
            DROP COLUMN fastingGlucose
        `);
    }

}
