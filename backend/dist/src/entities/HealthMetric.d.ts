import "reflect-metadata";
import { User } from "./User";
export declare class HealthMetric {
    id: string;
    userId: string;
    user: User;
    type: string;
    value: number;
    unit: string;
    date: Date;
}
