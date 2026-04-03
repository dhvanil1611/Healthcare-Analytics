import "reflect-metadata";
import { User } from "./User";
export declare class ChatbotLog {
    id: string;
    userId: string;
    user: User;
    sessionId: string;
    message: string;
    response: string;
    timestamp: Date;
}
