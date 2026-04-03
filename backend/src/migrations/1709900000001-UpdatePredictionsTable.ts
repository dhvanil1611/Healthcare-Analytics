import "reflect-metadata";
import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePredictionsTable1709900000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to predictions table
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

    // Update familyHistory to be boolean instead of varchar
    await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "familyHistory" TYPE boolean USING 
        CASE WHEN "familyHistory" = 'true' THEN true 
             WHEN "familyHistory" = 'false' THEN false 
             ELSE false END
    `);

    // Update probability precision
    await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "probability" TYPE decimal(5,4)
    `);

    // Make existing columns nullable for backward compatibility
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove new columns
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

    // Revert familyHistory to varchar
    await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "familyHistory" TYPE varchar(10) USING 
        CASE WHEN "familyHistory" = true THEN 'true' 
             WHEN "familyHistory" = false THEN 'false' 
             ELSE 'false' END
    `);

    // Revert probability precision
    await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "probability" TYPE decimal(5,2)
    `);

    // Make columns not nullable again
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
