"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePredictionsTable1709900000001 = void 0;
require("reflect-metadata");
class UpdatePredictionsTable1709900000001 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE predictions 
      ADD COLUMN "patientName" varchar(255) NULL,
      ADD COLUMN "gender" varchar(20) NULL,
      ADD COLUMN "pregnancies" int NULL,
      ADD COLUMN "fastingGlucose" int NULL,
      ADD COLUMN "systolicBP" int NULL,
      ADD COLUMN "diastolicBP" int NULL,
      ADD COLUMN "hba1c" decimal(10,2) NULL,
      ADD COLUMN "physicalActivity" varchar(50) NULL,
      ADD COLUMN "smoking" boolean NULL,
      ADD COLUMN "alcohol" boolean NULL,
      ADD COLUMN "excessiveThirst" boolean NULL,
      ADD COLUMN "frequentUrination" boolean NULL,
      ADD COLUMN "suddenWeightLoss" boolean NULL,
      ADD COLUMN "fastingBloodGlucose" int NULL,
      ADD COLUMN "diastolicBloodPressure" int NULL,
      ADD COLUMN "serumInsulin" decimal(10,2) NULL,
      ADD COLUMN "skinFoldThickness" int NULL
    `);
        await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "familyHistory" TYPE boolean USING 
        CASE WHEN "familyHistory" = 'true' THEN true 
             WHEN "familyHistory" = 'false' THEN false 
             ELSE false END
    `);
        await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "probability" TYPE decimal(5,4)
    `);
        await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "fastingBloodGlucose" DROP NOT NULL,
      ALTER COLUMN "diastolicBP" DROP NOT NULL,
      ALTER COLUMN "bmi" DROP NOT NULL,
      ALTER COLUMN "serumInsulin" DROP NOT NULL,
      ALTER COLUMN "skinfoldThickness" DROP NOT NULL,
      ALTER COLUMN "age" DROP NOT NULL,
      ALTER COLUMN "familyHistory" DROP NOT NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE predictions 
      DROP COLUMN "patientName",
      DROP COLUMN "gender",
      DROP COLUMN "pregnancies",
      DROP COLUMN "fastingGlucose",
      DROP COLUMN "systolicBP",
      DROP COLUMN "diastolicBP",
      DROP COLUMN "hba1c",
      DROP COLUMN "physicalActivity",
      DROP COLUMN "smoking",
      DROP COLUMN "alcohol",
      DROP COLUMN "excessiveThirst",
      DROP COLUMN "frequentUrination",
      DROP COLUMN "suddenWeightLoss"
    `);
        await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "familyHistory" TYPE varchar(10) USING 
        CASE WHEN "familyHistory" = true THEN 'true' 
             WHEN "familyHistory" = false THEN 'false' 
             ELSE 'false' END
    `);
        await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "probability" TYPE decimal(5,2)
    `);
        await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "fastingBloodGlucose" SET NOT NULL,
      ALTER COLUMN "diastolicBP" SET NOT NULL,
      ALTER COLUMN "bmi" SET NOT NULL,
      ALTER COLUMN "serumInsulin" SET NOT NULL,
      ALTER COLUMN "skinfoldThickness" SET NOT NULL,
      ALTER COLUMN "age" SET NOT NULL,
      ALTER COLUMN "familyHistory" SET NOT NULL
    `);
    }
}
exports.UpdatePredictionsTable1709900000001 = UpdatePredictionsTable1709900000001;
//# sourceMappingURL=1709900000001-UpdatePredictionsTable.js.map