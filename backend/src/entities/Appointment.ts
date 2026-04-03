import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User, user => user.appointments)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar", length: 255 })
  doctorName: string;

  @Column({ type: "varchar", length: 255 })
  specialization: string;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "varchar", length: 50 })
  time: string;

  @Column({ type: "varchar", length: 50, default: "Pending" })
  status: string; // Pending, Confirmed, Completed

  @Column({ type: "text", nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}