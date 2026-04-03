"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHealthcareTables1709900000000 = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
class CreateHealthcareTables1709900000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()",
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: "password",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "age",
                    type: "int",
                    isNullable: true,
                },
                {
                    name: "gender",
                    type: "varchar",
                    length: "50",
                    isNullable: true,
                },
                {
                    name: "phone",
                    type: "varchar",
                    length: "20",
                    isNullable: true,
                },
                {
                    name: "address",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "medicalHistory",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false,
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: "health_metrics",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()",
                },
                {
                    name: "userId",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "type",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "value",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "unit",
                    type: "varchar",
                    length: "50",
                    isNullable: false,
                },
                {
                    name: "date",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false,
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["userId"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: "appointments",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()",
                },
                {
                    name: "userId",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "doctorName",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "specialization",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "date",
                    type: "date",
                    isNullable: false,
                },
                {
                    name: "time",
                    type: "varchar",
                    length: "50",
                    isNullable: false,
                },
                {
                    name: "status",
                    type: "varchar",
                    length: "50",
                    default: "'Pending'",
                    isNullable: false,
                },
                {
                    name: "notes",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false,
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["userId"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: "chatbot_logs",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()",
                },
                {
                    name: "userId",
                    type: "uuid",
                    isNullable: true,
                },
                {
                    name: "sessionId",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "message",
                    type: "text",
                    isNullable: false,
                },
                {
                    name: "response",
                    type: "text",
                    isNullable: false,
                },
                {
                    name: "timestamp",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false,
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["userId"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "SET NULL",
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: "predictions",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()",
                },
                {
                    name: "userId",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "fastingBloodGlucose",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "diastolicBP",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "bmi",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "serumInsulin",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "skinfoldThickness",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "age",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "familyHistory",
                    type: "varchar",
                    length: "10",
                    isNullable: false,
                },
                {
                    name: "riskLevel",
                    type: "varchar",
                    length: "50",
                    isNullable: false,
                },
                {
                    name: "probability",
                    type: "decimal",
                    precision: 5,
                    scale: 2,
                    isNullable: false,
                },
                {
                    name: "advice",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false,
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["userId"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: "reports",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()",
                },
                {
                    name: "userId",
                    type: "uuid",
                    isNullable: false,
                },
                {
                    name: "filename",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "originalName",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "mimetype",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "size",
                    type: "bigint",
                    isNullable: false,
                },
                {
                    name: "uploadDate",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false,
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["userId"],
                    referencedTableName: "users",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable("reports");
        await queryRunner.dropTable("predictions");
        await queryRunner.dropTable("chatbot_logs");
        await queryRunner.dropTable("appointments");
        await queryRunner.dropTable("health_metrics");
        await queryRunner.dropTable("users");
    }
}
exports.CreateHealthcareTables1709900000000 = CreateHealthcareTables1709900000000;
//# sourceMappingURL=1709900000000-CreateHealthcareTables.js.map