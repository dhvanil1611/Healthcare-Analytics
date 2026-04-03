# AI-Powered Diabetes Risk Self-Assessment and Personal Healthcare System

A comprehensive web application for diabetes risk assessment using AI and machine learning. Built with React.js, Node.js, Express, and PostgreSQL.

## 📋 Project Overview

This is a final-year B.Tech Computer Engineering project that provides:

- **AI-Powered Risk Assessment**: Predict diabetes risk based on medical data
- **Personal HealthCare Dashboard**: Track health metrics and trends
- **Medical Report Management**: Upload and store medical documents
- **Appointment Booking**: Schedule doctor appointments
- **AI Health Chatbot**: Get answers to diabetes-related questions
- **Health Analytics**: Visualize health trends with charts
- **Personalized Recommendations**: Get diet and exercise suggestions based on risk profile

## 🎨 Features

### For Patients
- ✅ Secure JWT-based authentication
- ✅ Diabetes risk assessment form with clinical data
- ✅ AI-powered risk prediction (Low/Moderate/High)
- ✅ Health metrics tracking and visualization
- ✅ Medical report upload and storage
- ✅ Appointment booking interface
- ✅ Personalized health recommendations
- ✅ Floating AI chatbot widget
- ✅ Assessment history and analytics
- ✅ Mobile-responsive design

### Pages
1. **Landing Page** - Project introduction and call-to-action
2. **Diabetes Awareness** - Educational content about diabetes
3. **About Project** - Project details and scope
4. **Contact** - Get in touch
5. **Login/Register** - Secure authentication
6. **Dashboard** - Main patient hub with quick actions
7. **Assessment** - Diabetes risk assessment form
8. **Prediction Results** - Risk results with recommendations
9. **Health Analytics** - Charts and trend analysis

## 🛠️ Technology Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** runtime
- **Express.js** framework
- **TypeORM** ORM
- **PostgreSQL** database
- **JWT** authentication
- **Bcrypt** password hashing
- **Multer** file uploads

### DevOps & Tools
- **TypeScript** for type safety
- **ts-node** for development
- **ESLint** for code quality

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your database credentials:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=diabetes_assessment_db
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   ```

5. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE diabetes_assessment_db;
   ```

6. **Start backend server:**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Production Mode
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 📊 Database Schema

### Users Table
```
- id (UUID)
- name, email, password
- age, gender, phone, address
- medicalHistory
- createdAt, updatedAt
```

### Predictions Table
```
- id (UUID)
- userId (FK)
- fastingBloodGlucose, diastolicBloodPressure
- bmi, serumInsulin, skinFoldThickness
- age, familyHistory
- riskLevel, probability
- createdAt
```

### Appointments Table
```
- id (UUID)
- userId (FK)
- doctorName, specialization
- date, time
- status, notes
- createdAt
```

### Reports Table
```
- id (UUID)
- userId (FK)
- filename, originalName
- mimetype, size
- uploadDate
```

### Health Metrics Table
```
- id (UUID)
- userId (FK)
- type, value, unit
- date
```

### Chatbot Logs Table
```
- id (UUID)
- userId (FK)
- message, response
- timestamp
```

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ SQL injection prevention (TypeORM)
- ✅ Secure file upload handling
- ✅ Environment variable configuration
- ✅ HTTPS-ready architecture

## 🤖 ML Integration

The system is ready for ML model integration:

1. **Prediction Endpoint**: `/api/predictions/assess`
   - Accepts medical data and returns risk prediction
   - Currently uses rule-based scoring

2. **To integrate Python ML microservice:**
   - Configure `ML_API_URL` in `.env`
   - Update `calculateRisk()` function to call external ML API

## 📈 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Predictions
- `POST /api/predictions/assess` - Create assessment (Protected)
- `GET /api/predictions/history` - Get prediction history (Protected)
- `GET /api/predictions/:id` - Get specific prediction (Protected)

### Health Metrics
- `GET /api/health/metrics` - Get health metrics (Protected)
- `POST /api/health/metrics` - Add health metric (Protected)

### Appointments
- `GET /api/appointments` - Get user appointments (Protected)
- `POST /api/appointments` - Book appointment (Protected)
- `PUT /api/appointments/:id` - Update appointment (Protected)
- `DELETE /api/appointments/:id` - Cancel appointment (Protected)

### Reports
- `POST /api/reports/upload` - Upload medical report (Protected)
- `GET /api/reports` - Get user reports (Protected)
- `DELETE /api/reports/:id` - Delete report (Protected)

## 📱 UI/UX Design

### Design System
- **Colors**: Soft blue, white, and complementary accent colors
- **Font**: System fonts for optimal performance
- **Layout**: Card-based, clean hospital-style interface
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG compliant, keyboard navigation support
- **Responsive**: Mobile-first, works on all devices (320px-1920px)

### Components
- Navigation header with auth status
- Dashboard with quick action cards
- Assessment form with validation
- Risk gauge and chart visualizations
- Health recommendation cards
- Floating chatbot widget
- Assessment history table

## 🧪 Testing

```bash
# Backend tests (setup as needed)
cd backend
npm test

# Frontend tests (setup as needed)
cd frontend
npm test
```

## 📝 Environment Variables

Create `.env` file in backend directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=diabetes_assessment_db

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5000
NODE_ENV=development

# ML API (Optional)
ML_API_URL=http://localhost:8000
ML_API_KEY=api_key
```

## 🐛 Troubleshooting

### Backend Issues

**PostgreSQL Connection Error**
```bash
# Check if PostgreSQL is running
# Windows: Services > PostgreSQL
# Linux: sudo systemctl status postgresql
# macOS: brew services list | grep postgres
```

**Port Already in Use**
```bash
# Change PORT in .env
# Kill the process: netstat -ano | findstr :5000  (Windows)
```

### Frontend Issues

**Axios API Calls Failing**
- Ensure backend is running on `http://localhost:5000`
- Check CORS configuration in backend
- Verify JWT token in localStorage

**Charts Not Rendering**
- Install chart.js: `npm install chart.js`
- Ensure data format matches chart requirements

## 🎯 Future Enhancements

1. **Advanced ML Model**: Integrate scikit-learn or TensorFlow model
2. **Video Consultations**: Add telemedicine features
3. **Wearable Device Integration**: Connect with fitness trackers
4. **Multi-language Support**: I18n implementation
5. **Doctor Portal**: Dashboard for healthcare providers
6. **Mobile App**: React Native cross-platform app
7. **Payment Gateway**: For premium features
8. **Email Notifications**: Appointment reminders
9. **PDF Reports**: Downloadable health reports
10. **Analytics Dashboard**: Admin panel for system metrics

## 📊 Project Structure

```
healthcare-system/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── data-source.ts
│   │   ├── entities/ (User, Prediction, Appointment, Report, etc.)
│   │   └── migrations/
│   ├── routes/ (auth, predictions, appointments, reports, health)
│   ├── middleware/ (auth.ts)
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/ (9 pages for complete user flow)
│   │   ├── components/ (Form, Charts, Recommendations, Chatbot)
│   │   ├── services/ (API integration)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
└── README.md
```

## 📄 License

This project is created for educational purposes.

---

**Built with ❤️ for healthcare innovation**

### Security
- JWT authentication middleware
- Password encryption with bcrypt
- Input validation and sanitization
- CORS configuration

## 📁 Project Structure

```
health-care/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-care
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Predictions
- `GET /api/predictions` - Get user's predictions
- `POST /api/predictions` - Create new prediction

### Reports
- `GET /api/reports` - Get user's reports
- `POST /api/reports` - Upload new report

### Appointments
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Book new appointment

### Health
- `GET /api/health/metrics` - Get health metrics
- `POST /api/health/metrics` - Add health metric
- `POST /api/health/chatbot` - Chat with AI assistant

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend (if needed)
cd backend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Computer Engineering Student*

## 🙏 Acknowledgments

- Clinical diabetes assessment guidelines
- Open source community
- Educational institution supervisors

## 📞 Support

For support, email support@healthcareai.com or create an issue in the repository.

---

**Note**: This is a demonstration project. For production use, ensure proper security audits, compliance with healthcare regulations (HIPAA, GDPR), and professional medical validation.