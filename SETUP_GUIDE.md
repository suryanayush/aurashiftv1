# React Native + Backend Setup Guide

## 🚀 Quick Setup for Development

### 1. Backend Setup

```bash
cd backend
./setup.sh
# OR manually:
# npm install
# cp env.example .env
# npm run dev
```

Backend will be running on: `http://localhost:3000`

### 2. Frontend Setup

```bash
cd ..  # back to root
npm install
npx expo start
```

## 📱 Platform-Specific API Configuration

The app automatically detects the platform and uses the correct API endpoint:

- **iOS Simulator**: `http://localhost:3000/api`
- **Android Emulator**: `http://10.0.2.2:3000/api` 
- **Physical Device**: Set your computer's IP address (see below)

## 🔧 Network Configuration

### For Physical Devices

If testing on a physical device, you need to use your computer's IP address:

1. **Find your computer's IP address:**
   ```bash
   # macOS/Linux
   ipconfig getifaddr en0
   # Or
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **Update the API configuration** in `src/api/auth.ts`:
   ```typescript
   // Replace localhost with your IP
   return 'http://YOUR_IP_ADDRESS:3000/api';
   ```

3. **Update backend CORS** in `backend/.env`:
   ```env
   FRONTEND_URL=http://YOUR_IP_ADDRESS:19006
   ```

## 🐛 Troubleshooting

### Connection Issues

1. **Check backend is running:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Check from Android emulator:**
   ```bash
   curl http://10.0.2.2:3000/api/health
   ```

3. **Enable debug logging:**
   - API requests are automatically logged in development
   - Check React Native logs for `[API]` messages

### Common Issues

**Android Emulator "Network Error":**
- Make sure you're using `10.0.2.2` instead of `localhost`
- Backend CORS is configured to allow Android emulator

**iOS Simulator "Connection Refused":**
- Backend server should be running on `localhost:3000`
- Check if port 3000 is available

**Physical Device Issues:**
- Use your computer's IP address instead of localhost
- Ensure device and computer are on the same network
- Update CORS configuration with your IP

## 🔍 API Endpoints

Test these endpoints manually:

- **Health Check**: `GET /api/health`
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Profile**: `GET /api/auth/profile` (requires auth)
- **Onboarding**: `POST /api/onboarding/complete` (requires auth)

## 📋 Testing Workflow

1. **Start backend**: `cd backend && npm run dev`
2. **Start frontend**: `npx expo start`
3. **Open app** in emulator/simulator
4. **Register a new user** - should see API logs
5. **Complete onboarding** - should save to MongoDB
6. **Login with credentials** - should authenticate

## 🛡️ Security Notes

- JWT secrets are auto-generated in development
- CORS is configured for development (allows localhost)
- In production, update CORS and JWT secret properly

## 📱 Expo Development

The app works with:
- **Expo Go**: For testing on physical devices
- **Expo Development Build**: For custom native code
- **Web**: Via `npx expo start` and press `w`

## 🎯 Quick Test

After setup, test the connection:

```javascript
// In your app, this should work:
fetch('http://10.0.2.2:3000/api/health')  // Android
fetch('http://localhost:3000/api/health') // iOS
```

You should see the health check response in the logs! 🎉
