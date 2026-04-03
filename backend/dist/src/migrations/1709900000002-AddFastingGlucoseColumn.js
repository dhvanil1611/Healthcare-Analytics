"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFastingGlucoseColumn1709900000002 = void 0;
class AddFastingGlucoseColumn1709900000002 {
    constructor() {
        this.name = 'AddFastingGlucoseColumn1709900000002';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE predictions 
            ADD COLUMN fastingGlucose DECIMAL(10,2) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE predictions 
            DROP COLUMN fastingGlucose
        `);
    }
}
exports.AddFastingGlucoseColumn1709900000002 = AddFastingGlucoseColumn1709900000002;
//# sourceMappingURL=1709900000002-AddFastingGlucoseColumn.js.map