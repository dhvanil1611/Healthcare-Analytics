import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Hospital } from "./Hospital";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  rating: number;

  @Column({ type: "text" })
  reviewText: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => Hospital, hospital => hospital.reviews, { onDelete: "CASCADE" })
  hospital: Hospital;

  @Column({ type: "uuid" })
  hospitalId: string;
}
