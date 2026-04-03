import "reflect-metadata";
import { User } from "./User";
export declare class Prediction {
    id: string;
    userId: string;
    user: User;
    patientName: string;
    age: number;
    gender: string;
    pregnancies: number;
    systolicBP: number;
    diastolicBP: number;
    bmi: number;
    hba1c: number;
    fastingGlucose: number;
    familyHistory: boolean;
    diastolicBloodPressure: number;
    serumInsulin: number;
    skinFoldThickness: number;
    physicalActivity: string;
    smoking: boolean;
    alcohol: boolean;
    excessiveThirst: boolean;
    frequentUrination: boolean;
    suddenWeightLoss: boolean;
    riskLevel: string;
    probability: number;
    createdAt: Date;
}
