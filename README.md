# BarberPro Mobile

React Native + Expo mobile app for BarberPro barbershop management system. Client-facing companion to the [Next.js web app](../barberpro-nuevo).

## Tech Stack

- **Framework:** Expo SDK 54 + Expo Router 6 (file-based routing)
- **Language:** TypeScript 5.9
- **Styling:** NativeWind v4 (Tailwind CSS for React Native)
- **State:** TanStack Query 5 + React Context
- **Forms:** React Hook Form 7 + Zod 4
- **Auth:** JWT Bearer tokens via `expo-secure-store`
- **Icons:** Lucide React Native

## Prerequisites

- Node.js >= 20
- Backend running: `cd ../barberpro-nuevo && npm run dev`
- For Android: Android SDK, Java 21, Android emulator
- For iOS: Expo Go app on physical device

## Getting Started

```bash
# Install dependencies
npm install

# Start Metro bundler
npx expo start

# Run on Android emulator
npx expo run:android

# Run on iOS (physical device via Expo Go)
# Scan the QR code shown by `npx expo start`
```

## Android Setup (WSL2)

The Android SDK is on Windows at `F:\SDK-ANDROID-STUDIO`, mounted at `/mnt/f/SDK-ANDROID-STUDIO` in WSL2.

Required environment variables (already in `~/.bashrc`):

```bash
export ANDROID_HOME=/mnt/f/SDK-ANDROID-STUDIO
export ANDROID_SDK_ROOT=$ANDROID_HOME
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$HOME/.local/bin:$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
```

Running on the emulator:

```bash
# Start emulator
/mnt/f/SDK-ANDROID-STUDIO/emulator/emulator.exe -avd Medium_Phone_API_36.1

# Port forwarding (emulator -> WSL2 host)
adb reverse tcp:3000 tcp:3000   # Backend
adb reverse tcp:8081 tcp:8081   # Metro bundler

# Build and run
ANDROID_HOME=/mnt/f/SDK-ANDROID-STUDIO JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 npx expo run:android
```

## iOS Setup (Physical Device)

```bash
# Start with your Windows LAN IP
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.100.91 npx expo start --clear
```

Then scan the QR code with the Expo Go app on your iPhone.

## API Configuration

The app connects to the Next.js backend. URLs are configured in `src/constants/config.ts`:

| Platform | URL | Notes |
|----------|-----|-------|
| Android emulator | `http://10.0.2.2:3000` | Emulator alias for host localhost |
| iOS / Physical | `http://192.168.100.91:3000` | Windows LAN IP |
| Production | `https://your-production-domain.com` | Set before release |

## Project Structure

```
barberpro-mobile/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (providers + auth gate)
│   ├── (auth)/                   # Login & Register
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/                   # Bottom tab navigator
│       ├── index.tsx             # Home dashboard
│       ├── services.tsx          # Services catalog
│       ├── booking/              # 4-step booking wizard
│       │   ├── index.tsx         # Step 1: Service
│       │   ├── staff.tsx         # Step 2: Staff
│       │   ├── datetime.tsx      # Step 3: Date & time
│       │   └── confirm.tsx       # Step 4: Confirm
│       ├── appointments.tsx      # My appointments
│       └── profile/              # Profile section
│           ├── index.tsx         # Profile menu
│           ├── edit.tsx          # Edit profile
│           ├── password.tsx      # Change password
│           └── history.tsx       # Haircut history
├── src/
│   ├── components/
│   │   ├── ui/                   # Button, Card, Input, Badge, Avatar, etc.
│   │   ├── shared/               # EmptyState, LoadingSpinner
│   │   ├── services/             # ServiceCard
│   │   ├── appointments/         # AppointmentCard
│   │   └── staff/                # StaffCard
│   ├── hooks/                    # TanStack Query hooks
│   ├── lib/
│   │   ├── api-client.ts         # Fetch wrapper with auth headers
│   │   └── auth-storage.ts       # expo-secure-store wrapper
│   ├── providers/
│   │   ├── AuthProvider.tsx      # JWT auth context
│   │   ├── QueryProvider.tsx     # TanStack Query setup
│   │   ├── ThemeProvider.tsx     # Dark/light mode
│   │   └── BookingProvider.tsx   # Booking wizard state
│   ├── types/index.ts
│   └── constants/
│       ├── config.ts             # API_BASE_URL
│       ├── colors.ts             # Theme colors
│       └── status.ts             # Appointment status labels
├── assets/
│   ├── images/                   # App icons, logo
│   └── fonts/
├── android/                      # Generated native project
├── app.json                      # Expo config
├── babel.config.js               # NativeWind babel preset
├── tailwind.config.js            # Tailwind + NativeWind config
├── global.css                    # CSS variables for theming
└── metro.config.js               # NativeWind metro integration
```

## Authentication

The mobile app uses JWT Bearer tokens instead of NextAuth cookies:

1. Login via `POST /api/auth/mobile-login` returns a JWT
2. Token stored in `expo-secure-store` (encrypted device storage)
3. All API requests include `Authorization: Bearer <token>` header
4. Backend's `getSessionFromRequest()` handles both Bearer tokens (mobile) and cookies (web)

## Test Users

After seeding the backend database (`npm run db:seed`):

| Role | Email | Password |
|------|-------|----------|
| Client | `juan@example.com` | `User123!` |
| Staff | `carlos@barberpro.com` | `User123!` |
| Admin | `admin@barberpro.com` | `Admin123!` |

## Migration Log

See [migrate.md](./migrate.md) for the full step-by-step log of migrating from the Next.js web app to this React Native project.
