"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
const auth_1 = __importDefault(require("../routes/auth"));
const predictions_1 = __importDefault(require("../routes/predictions"));
const reports_1 = __importDefault(require("../routes/reports"));
const appointments_1 = __importDefault(require("../routes/appointments"));
const health_1 = __importDefault(require("../routes/health"));
const hospitals_1 = __importDefault(require("../routes/hospitals"));
const reviews_1 = __importDefault(require("../routes/reviews"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/predictions', predictions_1.default);
app.use('/api/reports', reports_1.default);
app.use('/api/appointments', appointments_1.default);
app.use('/api/health', health_1.default);
app.use('/api/hospitals', hospitals_1.default);
app.use('/api/reviews', reviews_1.default);
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('PostgreSQL connected with TypeORM');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((error) => console.log('TypeORM connection error:', error));
//# sourceMappingURL=server.js.map