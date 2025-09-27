# AuraShift - Complete Full Stack Implementation

AuraShift is a mobile application designed to help users quit smoking and track their progress. This repository contains both the React Native frontend and Express.js backend implementation.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or cloud instance)
- React Native development environment
- Expo CLI (for mobile development)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Copy the example environment file and configure it:
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file with your configuration. See `env.example` for all available options. Required variables:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/aurashift
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=12
   ```
   
   **Generate a secure JWT secret:**
   ```bash
   openssl rand -base64 32
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

4. **Run on your device:**
   - Scan the QR code with the Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator, `a` for Android emulator

## 🏗️ Architecture Overview

### Backend (`/backend`)

The backend is built with Express.js and provides a REST API with the following features:

- **Authentication:** JWT-based user registration and login
- **Onboarding:** User profile setup with smoking history
- **Database:** MongoDB with Mongoose ODM
- **Security:** Password hashing, rate limiting, input validation
- **TypeScript:** Full type safety throughout the application

#### API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/onboarding/complete` - Complete onboarding (protected)
- `PUT /api/onboarding/update` - Update onboarding data (protected)
- `GET /api/onboarding/status` - Get onboarding status (protected)
- `GET /api/health` - Health check

### Frontend (`/src`)

The frontend is built with React Native and Expo, featuring:

- **Authentication Flow:** Login and registration screens
- **Onboarding Process:** Multi-step user profile setup
- **API Integration:** Seamless backend communication
- **Local Storage:** Offline-first approach with AsyncStorage
- **TypeScript:** Type-safe development experience
- **UI/UX:** Modern, responsive design with NativeWind/Tailwind CSS

#### Key Components

- `LoginScreen` - User authentication
- `RegisterScreen` - New user registration
- `OnboardingFlow` - Multi-step profile setup
- `Dashboard` - Main app interface
- API integration in `/src/api/auth.ts`

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm start          # Start production server
npm test           # Run tests (when available)
```

### Frontend Development

```bash
npx expo start     # Start Expo development server
npx expo start -c  # Start with cleared cache
```

### Database Schema

#### User Model

```typescript
{
  displayName: string;
  email: string;
  password: string; // hashed
  smokingHistory?: {
    yearsSmoked: number;
    cigarettesPerDay: number;
    costPerPack: number;
    motivations: string[];
  };
  onboardingCompleted: boolean;
  auraScore: number;
  streakStartTime?: Date;
  lastSmoked?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔐 Security Features

- **Password Hashing:** bcrypt with configurable rounds
- **JWT Authentication:** Secure token-based auth
- **Input Validation:** express-validator for request validation
- **Rate Limiting:** Protection against abuse
- **CORS Configuration:** Controlled cross-origin requests
- **Helmet Security:** HTTP security headers

## 📱 Mobile Features

- **Cross-Platform:** iOS and Android support via React Native
- **Offline Support:** Local storage for critical data
- **Responsive Design:** Optimized for various screen sizes
- **Modern UI:** Clean, intuitive user interface
- **Progress Tracking:** Visual feedback for user journey

## 🚀 Deployment

### Backend Deployment

1. **Build the application:**
   ```bash
   cd backend
   npm run build
   ```

2. **Set production environment variables**

3. **Deploy to your preferred platform** (Railway, Heroku, DigitalOcean, etc.)

### Frontend Deployment

1. **Build for production:**
   ```bash
   npx eas build
   ```

2. **Submit to app stores:**
   ```bash
   npx eas submit
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/aurashift` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |

### Frontend

The frontend automatically detects the environment and configures API endpoints accordingly:

- **Development:** `http://localhost:3000/api`
- **Production:** Configure in `src/api/auth.ts`

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **JWT Secret Missing:**
   - Set `JWT_SECRET` in your `.env` file

3. **Metro bundler issues:**
   - Clear cache: `npx expo start -c`
   - Restart Metro: `npx expo r`

4. **TypeScript errors:**
   - Run `npx tsc` to check for type errors
   - Ensure all dependencies are properly installed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React Native and Expo
- Backend powered by Express.js and MongoDB
- UI design inspired by modern mobile design patterns
- Authentication flow following security best practices

---

**Happy coding! 🎉**

For questions or support, please open an issue in the repository.
