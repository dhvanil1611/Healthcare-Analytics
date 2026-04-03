import "reflect-metadata";
import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateHealthcareTables1709900000000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
