import "reflect-metadata";
import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UpdatePredictionsTable1709900000001 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
