import "@testing-library/jest-native/extend-expect";

// Mock global fetch
global.fetch = jest.fn();

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock nativewind
jest.mock("nativewind", () => ({
  useColorScheme: () => ({ colorScheme: "dark", setColorScheme: jest.fn() }),
  styled: (component: any) => component,
  cssInterop: jest.fn(),
}));

// Mock @react-native-async-storage/async-storage
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
  },
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children }: any) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock config - provide a stable API_BASE_URL for tests
jest.mock("@/src/constants/config", () => ({
  API_BASE_URL: "http://localhost:3000",
}));

// Mock ThemeProvider globally so all components using useTheme work
jest.mock("@/src/providers/ThemeProvider", () => ({
  ThemeProvider: ({ children }: any) => children,
  useTheme: () => ({
    theme: "dark" as const,
    isDark: true,
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
