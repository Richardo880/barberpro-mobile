# Test Suite Implementation Log

## Overview
Full test infrastructure setup for BarberPro Mobile — from zero to comprehensive test coverage before APK build.

**Date:** 2026-02-17
**Total test files planned:** 17
**Status:** In Progress

---

## Phase 1 — Install Dependencies

### Packages
- `jest-expo@~54` — Jest preset for Expo SDK 54
- `@testing-library/react-native@^13` — Component testing (supports React 19)
- `@testing-library/jest-native@^5` — Extended matchers (toBeVisible, toHaveTextContent, etc.)
- `react-test-renderer@19.1.0` — Already present in devDependencies

**Command:**
```bash
npm install --save-dev jest-expo@~54 @testing-library/react-native@^13 @testing-library/jest-native@^5
```

**Status:** Pending

---

## Phase 2 — Configuration Files

### 2.1 `package.json` — Add test scripts
Added:
- `"test": "jest"`
- `"test:watch": "jest --watch"`
- `"test:coverage": "jest --coverage"`

### 2.2 `babel.config.js` — Add env.test override
NativeWind uses `jsxImportSource: "nativewind"` which breaks JSX compilation in Jest.
Override to `jsxImportSource: "react"` when `NODE_ENV=test`.

### 2.3 `jest.config.js` — New file
- Preset: `jest-expo`
- Module name mapper for `@/` path alias
- Transform ignore patterns allowing all Expo/RN/NativeWind packages
- Setup file: `jest.setup.ts`

### 2.4 `jest.setup.ts` — New file
- Extends Jest matchers with `@testing-library/jest-native`
- Global `fetch` mock
- Mocks: `react-native-reanimated`, `nativewind`, `AsyncStorage`, `react-native-safe-area-context`
- `beforeEach(() => jest.clearAllMocks())`

---

## Phase 3 — Mock Files

### 3.1 `__mocks__/expo-secure-store.ts`
Mocks `getItemAsync`, `setItemAsync`, `deleteItemAsync` as `jest.fn()`.

### 3.2 `__mocks__/expo-router.ts`
Mocks `useRouter` (push, replace, back), `useSegments`, `Link`, `Stack`, `Tabs`.

### 3.3 `__mocks__/expo-splash-screen.ts`
Mocks `preventAutoHideAsync`, `hideAsync`.

### 3.4 `__mocks__/expo-image.ts`
Replaces `expo-image` `Image` with standard RN `Image`.

### 3.5 `__mocks__/lucide-react-native.ts`
All used icons (Scissors, Clock, Calendar, User, Eye, EyeOff, etc.) as stub `View` components.

### 3.6 `__mocks__/react-native-toast-message.ts`
`Toast.show` and `Toast.hide` as `jest.fn()`.

### 3.7 `__mocks__/@expo/vector-icons.ts`
Stub icon set components.

---

## Phase 4 — Test Helper

### `src/test-utils/render.tsx`
Custom render wrapper providing `QueryClientProvider` (retry: false, gcTime: 0) + `ThemeProvider`.
Used by component tests that depend on `useTheme()`.

---

## Phase 5 — Test Files

### 5.1 `src/hooks/__tests__/use-promotion.test.ts` — Pure Functions
**Tests:** `isPromoActive` and `getDiscountedPrice`
- isPromoActive: undefined config → false
- isPromoActive: enabled=false → false
- isPromoActive: wrong day → false
- isPromoActive: correct day → true
- getDiscountedPrice: inactive promo → original price
- getDiscountedPrice: active but service not in list → original price
- getDiscountedPrice: active + matching → discounted price
- getDiscountedPrice: discount exceeds price → clamp to 0

### 5.2 `src/lib/__tests__/auth-storage.test.ts` — Auth Storage
**Tests:** SecureStore wrapper functions
- saveToken/getToken round-trip
- getToken returns null when empty
- removeToken calls deleteItemAsync
- saveUser serializes to JSON
- getUser deserializes from JSON
- getUser returns null for invalid JSON
- clearAuth deletes both keys

### 5.3 `src/lib/__tests__/api-client.test.ts` — API Client
**Tests:** Fetch wrapper with auth
- Attaches Bearer token from secure store
- Skips auth header when skipAuth: true
- No auth header when no token stored
- Throws AuthError + clears auth on 401
- Parses server error message on non-OK
- Falls back to "Error {status}" on unparseable body
- Returns {} for empty body (204)
- Returns parsed JSON on success

### 5.4 `src/components/ui/__tests__/Button.test.tsx`
**Tests:** Button component
- Renders string children
- Loading shows ActivityIndicator
- Disabled when loading=true
- Disabled when disabled=true
- Fires onPress when not disabled

### 5.5 `src/components/ui/__tests__/Badge.test.tsx`
**Tests:** Badge component
- Renders children text
- All variants render without crash
- Custom backgroundColor applied
- Custom color applied

### 5.6 `src/components/ui/__tests__/ProgressBar.test.tsx`
**Tests:** ProgressBar clamping
- Correct width percentage
- Clamps <0 to 0%
- Clamps >100 to 100%

### 5.7 `src/components/ui/__tests__/Avatar.test.tsx`
**Tests:** Avatar initials + image
- Single word name → first 2 chars
- Two word name → initials of each
- Three word name → first 2 initials
- Lowercase → uppercased
- Shows Image when source provided
- Shows initials when source is null

### 5.8 `src/components/ui/__tests__/Input.test.tsx`
**Tests:** Input with label, error, password toggle
- Renders label text
- Displays error message
- secureTextEntry true by default for isPassword
- Eye icon press toggles visibility

### 5.9 `src/components/shared/__tests__/EmptyState.test.tsx`
**Tests:** EmptyState optional sections
- Renders title
- Optional description
- Optional icon
- Action button only when both actionLabel + onAction

### 5.10 `src/components/services/__tests__/ServiceCard.test.tsx`
**Tests:** ServiceCard with promotions
- Service name, description, duration
- Price without promo
- Discounted price with active promo
- onPress callback
- Image vs placeholder (no imageUrl)

### 5.11 `src/components/appointments/__tests__/AppointmentCard.test.tsx`
**Tests:** AppointmentCard with cancel logic
- Service name, staff name, status badge
- Cancel button for PENDING/CONFIRMED
- No cancel button for COMPLETED
- Alert.alert on cancel press
- Calls onCancel with appointment id on confirm
- clientNotes section

### 5.12 `src/providers/__tests__/BookingProvider.test.tsx`
**Tests:** Booking wizard state management
- Initial state all null/empty
- setService/setStaff/setDateTime/setNotes update correctly
- reset clears all state
- State doesn't leak between fields
- Throws outside provider

### 5.13 `src/providers/__tests__/AuthProvider.test.tsx`
**Tests:** Auth flows
- Starts loading, resolves to unauthenticated
- Restores session from SecureStore
- No restore when token missing
- Login success sets user
- Login failure throws error
- Logout clears state + storage
- Register calls endpoint then auto-logins

### 5.14 `app/(auth)/__tests__/login.test.tsx`
**Tests:** Login screen integration
- Renders email/password inputs
- Error toast on empty fields
- Calls login with trimmed email
- Error toast on failed login

### 5.15 `app/(auth)/__tests__/register.test.tsx`
**Tests:** Register screen integration
- Renders all form fields
- Error toast for empty required fields
- Error toast for mismatched passwords
- Error toast for weak password (short, no uppercase, no digit)
- Successful registration call

---

## Phase 6 — Run Tests & Verify

```bash
npm test
```

Expected: All 17 test files pass.

---

## Results

*(Updated after execution)*
