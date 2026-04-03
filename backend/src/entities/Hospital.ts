import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Review } from "./Review";

@Entity("hospitals")
export class Hospital {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  area: string;

  @Column({ type: "text" })
  address: string;

  @Column({ type: "varchar", length: 255 })
  doctorName: string;

  @Column({ type: "varchar", length: 255 })
  specialization: string;

  @Column({ type: "varchar", length: 100 })
  timings: string;

  @Column({ type: "varchar", length: 20 })
  contactNumber: string;

  @Column({ type: "text", nullable: true })
  imageUrl: string;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int", default: 0 })
  totalReviews: number;

  @Column({ type: "decimal", precision: 2, scale: 1, default: 0 })
  averageRating: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Review, review => review.hospital)
  reviews: Review[];
}
