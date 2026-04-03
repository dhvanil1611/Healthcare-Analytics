import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { HealthMetric } from "./entities/HealthMetric";
import { Appointment } from "./entities/Appointment";
import { ChatbotLog } from "./entities/ChatbotLog";
import { Prediction } from "./entities/Prediction";
import { Report } from "./entities/Report";
import { Hospital } from "./entities/Hospital";
import { Review } from "./entities/Review";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Use migrations instead
  logging: true,
  entities: [User, HealthMetric, Appointment, ChatbotLog, Prediction, Report, Hospital, Review],
});