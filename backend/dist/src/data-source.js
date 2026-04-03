"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const HealthMetric_1 = require("./entities/HealthMetric");
const Appointment_1 = require("./entities/Appointment");
const ChatbotLog_1 = require("./entities/ChatbotLog");
const Prediction_1 = require("./entities/Prediction");
const Report_1 = require("./entities/Report");
const Hospital_1 = require("./entities/Hospital");
const Review_1 = require("./entities/Review");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User_1.User, HealthMetric_1.HealthMetric, Appointment_1.Appointment, ChatbotLog_1.ChatbotLog, Prediction_1.Prediction, Report_1.Report, Hospital_1.Hospital, Review_1.Review],
});
//# sourceMappingURL=data-source.js.map