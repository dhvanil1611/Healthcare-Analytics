import "reflect-metadata";
import { User } from "./User";
export declare class Report {
    id: string;
    userId: string;
    user: User;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    uploadDate: Date;
}
