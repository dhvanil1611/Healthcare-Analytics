import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { HealthMetric } from "./HealthMetric";
import { Appointment } from "./Appointment";
import { ChatbotLog } from "./ChatbotLog";
import { Prediction } from "./Prediction";
import { Report } from "./Report";
import { Review } from "./Review";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  resetToken: string;

  @Column({ type: "timestamp", nullable: true })
  resetTokenExpires: Date;

  @Column({ type: "boolean", default: false })
  isEmailVerified: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  emailVerificationToken: string;

  @Column({ type: "int", nullable: true })
  age: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  gender: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ type: "text", nullable: true })
  medicalHistory: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => HealthMetric, healthMetric => healthMetric.user)
  healthMetrics: HealthMetric[];

  @OneToMany(() => Appointment, appointment => appointment.user)
  appointments: Appointment[];

  @OneToMany(() => ChatbotLog, chatbotLog => chatbotLog.user)
  chatbotLogs: ChatbotLog[];

  @OneToMany(() => Prediction, prediction => prediction.user)
  predictions: Prediction[];

  @OneToMany(() => Report, report => report.user)
  reports: Report[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];
}