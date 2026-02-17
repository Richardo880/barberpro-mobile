import React from "react";

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => false),
}));

export const useSegments = jest.fn(() => []);
export const usePathname = jest.fn(() => "/");
export const useLocalSearchParams = jest.fn(() => ({}));

export const Link = ({ children }: { children: React.ReactNode }) => children;
export const Stack = ({ children }: { children?: React.ReactNode }) => children ?? null;
Stack.Screen = ({ children }: { children?: React.ReactNode }) => children ?? null;
export const Tabs = ({ children }: { children?: React.ReactNode }) => children ?? null;
Tabs.Screen = ({ children }: { children?: React.ReactNode }) => children ?? null;
export const Redirect = () => null;
