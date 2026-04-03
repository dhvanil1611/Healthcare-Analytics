import "reflect-metadata";
import { User } from "./User";
import { Hospital } from "./Hospital";
export declare class Review {
    id: string;
    rating: number;
    reviewText: string;
    createdAt: Date;
    user: User;
    userId: string;
    hospital: Hospital;
    hospitalId: string;
}
