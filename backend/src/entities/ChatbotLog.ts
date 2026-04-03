import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("chatbot_logs")
export class ChatbotLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: true })
  userId: string;

  @ManyToOne(() => User, user => user.chatbotLogs, { nullable: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar", length: 255, nullable: true })
  sessionId: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "text" })
  response: string;

  @CreateDateColumn()
  timestamp: Date;
}