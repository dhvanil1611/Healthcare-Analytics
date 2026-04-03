import "reflect-metadata";
import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDatabaseSchema1709900000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Fix predictions table schema to match entity definition
    await queryRunner.query(`
      ALTER TABLE predictions 
      -- Add missing new fields
      ADD COLUMN IF NOT EXISTS "patientName" varchar(255) NULL,
      ADD COLUMN IF NOT EXISTS "gender" varchar(20) NULL,
      ADD COLUMN IF NOT EXISTS "pregnancies" int NULL,
      ADD COLUMN IF NOT EXISTS "systolicBP" int NULL,
      ADD COLUMN IF NOT EXISTS "diastolicBP" int NULL,
      ADD COLUMN IF NOT EXISTS "hba1c" decimal(10,2) NULL,
      ADD COLUMN IF NOT EXISTS "physicalActivity" varchar(50) NULL,
      ADD COLUMN IF NOT EXISTS "smoking" boolean NULL,
      ADD COLUMN IF NOT EXISTS "alcohol" boolean NULL,
      ADD COLUMN IF NOT EXISTS "excessiveThirst" boolean NULL,
      ADD COLUMN IF NOT EXISTS "frequentUrination" boolean NULL,
      ADD COLUMN IF NOT EXISTS "suddenWeightLoss" boolean NULL
    `);

    // Fix fastingGlucose column type and ensure it exists
    await queryRunner.query(`
      ALTER TABLE predictions 
      DROP COLUMN IF EXISTS "fastingGlucose",
      ADD COLUMN "fastingGlucose" decimal(10,2) NULL
    `);

    // Fix familyHistory to be boolean
    await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "familyHistory" TYPE boolean USING 
        CASE WHEN "familyHistory" IN ('true', '1', 'yes', 'True') THEN true 
             WHEN "familyHistory" IN ('false', '0', 'no', 'False') THEN false 
             ELSE COALESCE("familyHistory"::boolean, false) END
    `);

    // Fix probability precision to match entity
    await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "probability" TYPE decimal(5,4) USING "probability"::decimal(5,4)
    `);

    // Make columns nullable for flexibility
    await queryRunner.query(`
      ALTER TABLE predictions 
      ALTER COLUMN "fastingBloodGlucose" DROP NOT NULL,
      ALTER COLUMN "diastolicBP" DROP NOT NULL,
      ALTER COLUMN "bmi" DROP NOT NULL,
      ALTER COLUMN "serumInsulin" DROP NOT NULL,
      ALTER COLUMN "skinfoldThickness" DROP NOT NULL,
      ALTER COLUMN "age" DROP NOT NULL,
      ALTER COLUMN "familyHistory" DROP NOT NULL,
      ALTER COLUMN "riskLevel" DROP NOT NULL,
      ALTER COLUMN "probability" DROP NOT NULL
    `);

    // Add missing columns to users table if they don't exist
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "resetToken" varchar(255) NULL,
      ADD COLUMN IF NOT EXISTS "resetTokenExpires" timestamp NULL,
      ADD COLUMN IF NOT EXISTS "isEmailVerified" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "emailVerificationToken" varchar(255) NULL
    `);

    // Add missing indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_predictions_userId" ON predictions("userId");
      CREATE INDEX IF NOT EXISTS "IDX_health_metrics_userId" ON health_metrics("userId");
      CREATE INDEX IF NOT EXISTS "IDX_appointments_userId" ON appointments("userId");
      CREATE INDEX IF NOT EXISTS "IDX_chatbot_logs_userId" ON chatbot_logs("userId");
      CREATE INDEX IF NOT EXISTS "IDX_reports_userId" ON reports("userId");
      CREATE INDEX IF NOT EXISTS "IDX_users_email" ON users("email");
      CREATE INDEX IF NOT EXISTS "IDX_users_resetToken" ON users("resetToken");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_predictions_userId";
      DROP INDEX IF EXISTS "IDX_health_metrics_userId";
      DROP INDEX IF EXISTS "IDX_appointments_userId";
      DROP INDEX IF EXISTS "IDX_chatbot_logs_userId";
      DROP INDEX IF EXISTS "IDX_reports_userId";
      DROP INDEX IF EXISTS "IDX_users_email";
      DROP INDEX IF EXISTS "IDX_users_resetToken";
    `);

    // Remove new columns from users table
    await queryRunner.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS "resetToken",
      DROP COLUMN IF EXISTS "resetTokenExpires",
      DROP COLUMN IF EXISTS "isEmailVerified",
      DROP COLUMN IF EXISTS "emailVerificationToken"
    `);

    // Revert predictions table changes
    await queryRunner.query(`
      ALTER TABLE predictions 
      DROP COLUMN IF EXISTS "patientName",
      DROP COLUMN IF EXISTS "gender",
      DROP COLUMN IF EXISTS "pregnancies",
      DROP COLUMN IF EXISTS "systolicBP",
      DROP COLUMN IF EXISTS "diastolicBP",
      DROP COLUMN IF EXISTS "hba1c",
      DROP COLUMN IF EXISTS "physicalActivity",
      DROP COLUMN IF EXISTS "smoking",
      DROP COLUMN IF EXISTS "alcohol",
      DROP COLUMN IF EXISTS "excessiveThirst",
      DROP COLUMN IF EXISTS "frequentUrination",
      DROP COLUMN IF EXISTS "suddenWeightLoss"
    `);
  }
}
