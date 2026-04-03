import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddFastingGlucoseColumn1709900000002 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
