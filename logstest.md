# Session Log — 2026-02-17: Test Suite + Production APK Build

## Overview

Set up a complete test suite for the BarberPro Mobile app (from zero test infrastructure) and built a production APK connected to the Vercel backend + Supabase database.

---

## Phase 1 — Test Suite Implementation

### Dependencies Installed

```bash
npm install --save-dev jest-expo@~54 @testing-library/react-native@^13 @testing-library/jest-native@^5
```

### Configuration Files Created/Edited

| File | Action | Purpose |
|------|--------|---------|
| `jest.config.js` | Created | jest-expo preset, `@/` path alias, `transformIgnorePatterns` including `expo-modules-core` |
| `jest.setup.ts` | Created | Global mocks: fetch, reanimated, nativewind, AsyncStorage, ThemeProvider, safe-area-context, config |
| `babel.config.js` | Edited | Added `env.test` block overriding `jsxImportSource` to `"react"` (NativeWind JSX breaks Jest) |
| `package.json` | Edited | Added `test`, `test:watch`, `test:coverage` scripts |

### Mock Files Created (`__mocks__/`)

| File | Mocks |
|------|-------|
| `expo-secure-store.ts` | `getItemAsync`, `setItemAsync`, `deleteItemAsync` |
| `expo-router.ts` | `useRouter`, `useSegments`, `Link`, `Stack`, `Tabs` |
| `expo-splash-screen.ts` | `preventAutoHideAsync`, `hideAsync` |
| `expo-image.ts` | `Image` → standard RN Image |
| `lucide-react-native.ts` | All used icons as stub View components |
| `react-native-toast-message.ts` | `Toast.show`, `Toast.hide` |
| `@expo/vector-icons.ts` | `Ionicons`, `MaterialIcons`, etc. |

### Test Helper

- `src/test-utils/render.tsx` — `renderWithProviders` wrapping components in `QueryClientProvider`

### Test Files (15 files, 108 tests)

| File | Tests | Area |
|------|-------|------|
| `src/hooks/__tests__/use-promotion.test.ts` | 9 | Pure functions: `isPromoActive`, `getDiscountedPrice` |
| `src/lib/__tests__/auth-storage.test.ts` | 7 | Token/user CRUD via SecureStore |
| `src/lib/__tests__/api-client.test.ts` | 7 | Fetch wrapper: auth headers, 401 handling, error parsing |
| `src/components/ui/__tests__/Button.test.tsx` | 6 | Render, loading spinner, disabled, onPress |
| `src/components/ui/__tests__/Badge.test.tsx` | 5 | Render, variants, custom colors |
| `src/components/ui/__tests__/ProgressBar.test.tsx` | 5 | Width %, clamping <0 and >100 |
| `src/components/ui/__tests__/Avatar.test.tsx` | 6 | Initials logic, image rendering |
| `src/components/ui/__tests__/Input.test.tsx` | 6 | Label, error, password toggle |
| `src/components/shared/__tests__/EmptyState.test.tsx` | 7 | Title, description, icon, action button |
| `src/components/services/__tests__/ServiceCard.test.tsx` | 7 | Service info, promo pricing, image placeholder |
| `src/components/appointments/__tests__/AppointmentCard.test.tsx` | 11 | Status badge, cancel flow with Alert, clientNotes |
| `src/providers/__tests__/BookingProvider.test.tsx` | 8 | Wizard state: set/reset service, staff, date, notes |
| `src/providers/__tests__/AuthProvider.test.tsx` | 6 | Session restore, login, logout, register |
| `app/(auth)/__tests__/login.test.tsx` | 5 | Inputs, empty field toast, login call, error toast |
| `app/(auth)/__tests__/register.test.tsx` | 9 | Inputs, validation toasts (empty/mismatch/weak password), register call |

### Issues Fixed During Setup

1. **`setupFilesAfterSetup` typo** → correct Jest key is `setupFilesAfterEnv`
2. **`expo-modules-core` not transformed** → added to `transformIgnorePatterns`
3. **`useTheme` crash** → moved ThemeProvider mock to `jest.setup.ts` (global) instead of per-file
4. **API client 401 test** → was calling `apiClient` twice with single mock; fixed to single call with try/catch
5. **Register screen "Crear Cuenta"** → text appears as heading + button; switched to `getAllByText` picking last match

### Final Test Results

```
Test Suites: 15 passed, 15 total
Tests:       108 passed, 108 total
Snapshots:   0 total

Coverage: 93.29% statements | 84.82% branches | 84.21% functions | 94.02% lines
```

---

## Phase 2 — Production APK Build

### Step 1: Updated Production URL

Changed `src/constants/config.ts`:
```
- "https://your-production-domain.com"
+ "https://barberia-imperio-py.vercel.app"
```

### Step 2: EAS Build Configuration

- Installed EAS CLI via `npx eas-cli`
- Ran `npx eas-cli login` (Expo account: richardo880)
- Ran `npx eas-cli build:configure` → generated `eas.json`
- Updated `eas.json` preview profile to output APK:

```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  }
}
```

### Step 3: Built APK

```bash
npx eas-cli build --platform android --profile preview
```

Build completed successfully in Expo cloud.

### Step 4: Install on Emulator

- Initial install failed: `INSTALL_FAILED_UPDATE_INCOMPATIBLE` (signing key mismatch with old dev build)
- Fixed by uninstalling old app: `adb uninstall com.barberpro.app`
- Reinstalled via: `npx eas-cli build:run --platform android`

### Step 5: Connection Error Fix

- Login from APK returned "Error de conexión"
- Root cause: backend mobile endpoints were not deployed to Vercel
- The following files existed locally in `barberpro-nuevo` but were uncommitted:
  - `src/app/api/auth/mobile-login/route.ts`
  - `src/app/api/auth/mobile-google/route.ts`
  - `src/lib/auth-mobile.ts`
  - Modified `src/middleware.ts`
- Committed and pushed to main → Vercel auto-deployed
- Login working correctly after deployment

### Verification

Tested endpoint reachability:
```bash
curl -s -X POST https://barberia-imperio-py.vercel.app/api/auth/mobile-login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
# Before deploy: "Error: This action with HTTP POST is not supported by NextAuth.js"
# After deploy: 400 (valid response from mobile-login route)
```

---

## Final State

- **Test suite**: 15 files, 108 tests, all passing, ~93% coverage
- **APK**: Built via EAS `preview` profile, installed on Android emulator
- **Production**: Connected to `https://barberia-imperio-py.vercel.app` (Vercel + Supabase)
- **Login**: Working correctly end-to-end
