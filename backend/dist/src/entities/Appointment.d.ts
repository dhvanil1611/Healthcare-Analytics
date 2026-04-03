import "reflect-metadata";
import { User } from "./User";
export declare class Appointment {
    id: string;
    userId: string;
    user: User;
    doctorName: string;
    specialization: string;
    date: Date;
    time: string;
    status: string;
    notes: string;
    createdAt: Date;
}
