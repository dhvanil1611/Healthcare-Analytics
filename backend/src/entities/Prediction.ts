import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("predictions")
export class Prediction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User, user => user.predictions)
  @JoinColumn({ name: "userId" })
  user: User;

  // Personal Details
  @Column({ type: "varchar", length: 255, nullable: true })
  patientName: string;

  @Column({ type: "int" })
  age: number;

  @Column({ type: "varchar", length: 20, nullable: true })
  gender: string; // Male, Female, Other

  @Column({ type: "int", nullable: true })
  pregnancies: number; // Only for females

  // Medical Measurements
  @Column({ type: "int", nullable: true })
  systolicBP: number;

  @Column({ type: "int", nullable: true })
  diastolicBP: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  bmi: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  hba1c: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  fastingGlucose: number;

  @Column({ type: "boolean", default: false })
  familyHistory: boolean;

  // Legacy fields (kept for backward compatibility)
  @Column({ type: "int", nullable: true })
  diastolicBloodPressure: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  serumInsulin: number;

  @Column({ type: "int", nullable: true })
  skinFoldThickness: number;

  // Lifestyle Factors
  @Column({ type: "varchar", length: 50, nullable: true })
  physicalActivity: string; // No Activity, Little Activity, Moderate Activity, High Activity

  @Column({ type: "boolean", nullable: true })
  smoking: boolean;

  @Column({ type: "boolean", nullable: true })
  alcohol: boolean;

  // Symptoms
  @Column({ type: "boolean", nullable: true })
  excessiveThirst: boolean;

  @Column({ type: "boolean", nullable: true })
  frequentUrination: boolean;

  @Column({ type: "boolean", nullable: true })
  suddenWeightLoss: boolean;

  // Results
  @Column({ type: "varchar", length: 50 })
  riskLevel: string; // Low, Moderate, High

  @Column({ type: "decimal", precision: 5, scale: 4 })
  probability: number;

  @CreateDateColumn()
  createdAt: Date;
}