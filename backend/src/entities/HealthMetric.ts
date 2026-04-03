import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("health_metrics")
export class HealthMetric {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User, user => user.healthMetrics)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar", length: 100 })
  type: string; // glucose, bmi, etc.

  @Column({ type: "decimal", precision: 10, scale: 2 })
  value: number;

  @Column({ type: "varchar", length: 50 })
  unit: string;

  @CreateDateColumn()
  date: Date;
}