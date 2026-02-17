# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BarberPro Mobile — React Native (Expo SDK 54) client app for a barbershop management system. This is the customer-facing companion to a Next.js backend at `../barberpro-nuevo`. The app is in Spanish (UI strings, toast messages, error messages).

## Commands

```bash
# Start Metro bundler
npx expo start

# Run on Android emulator (WSL2 setup)
ANDROID_HOME=/mnt/f/SDK-ANDROID-STUDIO JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 npx expo run:android

# Run on iOS physical device (update IP as needed)
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.100.91 npx expo start --clear

# TypeScript check
npx tsc --noEmit
```

No test framework is configured. No linter is configured.

## Architecture

### Routing (Expo Router 6 — file-based)

- `app/_layout.tsx` — Root layout, wraps the entire app in providers: `ThemeProvider > QueryProvider > AuthProvider > BookingProvider > AuthGate`
- `app/(auth)/` — Login and register screens (unauthenticated)
- `app/(tabs)/` — Bottom tab navigator (authenticated): Home, Services, Booking wizard, Appointments, Profile
- `app/(tabs)/booking/` — 4-step wizard: select service → select staff → pick date/time → confirm
- `app/(tabs)/profile/` — Profile menu, edit profile, change password, haircut history

The `AuthGate` component in `_layout.tsx` handles route protection: redirects unauthenticated users to `/(auth)/login` and authenticated users away from `/(auth)`.

### Data Layer

- **API client** (`src/lib/api-client.ts`): `apiClient<T>(path, options)` — fetch wrapper that auto-attaches JWT Bearer token and handles 401 by clearing auth.
- **TanStack Query hooks** (`src/hooks/`): One file per domain — `use-appointments.ts`, `use-services.ts`, `use-staff.ts`, `use-records.ts`, `use-users.ts`, `use-promotion.ts`. Each exports query hooks (`useQuery`) and mutation hooks (`useMutation`) that call `apiClient`.
- **Auth storage** (`src/lib/auth-storage.ts`): Token and user data persisted via `expo-secure-store`.

### State Management

- **Server state**: TanStack Query 5 (all API data)
- **Auth state**: React Context (`AuthProvider`) — manages login/register/logout, stores JWT + user
- **Booking wizard state**: React Context (`BookingProvider`) — accumulates selections across the 4-step booking flow
- **Theme**: React Context (`ThemeProvider`) — dark/light mode

### Styling

NativeWind v4 (Tailwind CSS for React Native). Theme colors defined as CSS variables in `global.css` with dark mode via `prefers-color-scheme`. Semantic color tokens: `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `destructive`, `border`, `input`.

Use `className` prop with Tailwind classes on React Native components. The tailwind config is in `tailwind.config.js` with the nativewind preset.

### UI Components

Reusable components in `src/components/ui/`: `Button`, `Card`, `Input`, `Badge`, `Avatar`, `SegmentedControl`, `ProgressBar`. Domain components in `src/components/services/`, `src/components/appointments/`, `src/components/staff/`.

### API Configuration

`src/constants/config.ts` — `API_BASE_URL` switches per platform in dev mode: `10.0.2.2:3000` for Android emulator, LAN IP for physical devices/iOS.

### Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`). Example: `@/src/components/ui/Button`.

### Types

All shared TypeScript types are in `src/types/index.ts`: `AuthUser`, `Service`, `StaffMember`, `Appointment`, `TimeSlot`, `HaircutRecord`, `PaginationMeta`.

## Key Patterns

- All API hooks follow the pattern: query hook returns `useQuery`, mutation hooks return `useMutation` with automatic query invalidation and `Toast.show()` for user feedback.
- Forms use `react-hook-form` with `zod` schemas for validation.
- Icons use `lucide-react-native`.
- The backend must be running for the app to work (`cd ../barberpro-nuevo && npm run dev`).
- Expo typed routes are enabled (`experiments.typedRoutes` in `app.json`).
