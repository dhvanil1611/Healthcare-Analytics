import "reflect-metadata";
import { HealthMetric } from "./HealthMetric";
import { Appointment } from "./Appointment";
import { ChatbotLog } from "./ChatbotLog";
import { Prediction } from "./Prediction";
import { Report } from "./Report";
import { Review } from "./Review";
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    medicalHistory: string;
    createdAt: Date;
    healthMetrics: HealthMetric[];
    appointments: Appointment[];
    chatbotLogs: ChatbotLog[];
    predictions: Prediction[];
    reports: Report[];
    reviews: Review[];
}
