# AuraShift Backend API

Backend API for the AuraShift mobile application - helping users quit smoking and track their progress.

## Features

- User authentication (register, login)
- Onboarding flow for new users
- Secure password hashing with bcrypt
- JWT-based authentication
- MongoDB database integration
- Input validation and sanitization
- Rate limiting and security middleware

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Quick Setup (Recommended)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the setup script:
```bash
./setup.sh
```

The setup script will automatically:
- Install dependencies
- Create `.env` file from `env.example`
- Generate a secure JWT secret
- Check MongoDB connection
- Provide next steps

### Manual Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update the `.env` file with your configuration. The `env.example` file contains all available environment variables with detailed comments. At minimum, configure these required variables:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/aurashift
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

⚠️ **Important**: Generate a strong JWT secret for production:
```bash
openssl rand -base64 32
```

5. Start the development server:
```bash
npm run dev
```

### Production

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Onboarding (`/api/onboarding`)

- `POST /api/onboarding/complete` - Complete onboarding process (protected)
- `PUT /api/onboarding/update` - Update onboarding data (protected)
- `GET /api/onboarding/status` - Get onboarding status (protected)

### Health Check

- `GET /api/health` - API health status
- `GET /` - Welcome message

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── types/          # TypeScript types and interfaces
│   ├── utils/          # Utility functions
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/aurashift` |
| `JWT_SECRET` | JWT signing secret | Required in production |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `BCRYPT_ROUNDS` | Bcrypt hashing rounds | `12` |

## Security Features

- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- Password hashing with bcrypt
- JWT token authentication

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

### Database

The application uses MongoDB with Mongoose ODM. The database will be automatically created when you first run the application.

### Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.
