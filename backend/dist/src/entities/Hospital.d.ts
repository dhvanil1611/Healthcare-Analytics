import "reflect-metadata";
import { Review } from "./Review";
export declare class Hospital {
    id: string;
    name: string;
    area: string;
    address: string;
    doctorName: string;
    specialization: string;
    timings: string;
    contactNumber: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    description: string;
    totalReviews: number;
    averageRating: number;
    createdAt: Date;
    reviews: Review[];
}
