import * as SecureStore from "expo-secure-store";
import {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  clearAuth,
} from "../auth-storage";
import type { AuthUser } from "@/src/types";

describe("auth-storage", () => {
  const mockUser: AuthUser = {
    id: "u1",
    email: "test@example.com",
    name: "Test User",
    role: "CLIENT",
  };

  describe("token operations", () => {
    it("saveToken calls setItemAsync with the correct key", async () => {
      await saveToken("my-token");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "barberpro_token",
        "my-token"
      );
    });

    it("getToken calls getItemAsync with the correct key", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("stored-token");
      const token = await getToken();
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("barberpro_token");
      expect(token).toBe("stored-token");
    });

    it("removeToken calls deleteItemAsync with the correct key", async () => {
      await removeToken();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("barberpro_token");
    });
  });

  describe("user operations", () => {
    it("saveUser serializes user to JSON", async () => {
      await saveUser(mockUser);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "barberpro_user",
        JSON.stringify(mockUser)
      );
    });

    it("getUser deserializes stored JSON", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockUser)
      );
      const user = await getUser();
      expect(user).toEqual(mockUser);
    });

    it("getUser returns null when no data stored", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
      const user = await getUser();
      expect(user).toBeNull();
    });

    it("getUser returns null on invalid JSON", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce("not-json{");
      const user = await getUser();
      expect(user).toBeNull();
    });

    it("removeUser calls deleteItemAsync with the correct key", async () => {
      await removeUser();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("barberpro_user");
    });
  });

  describe("clearAuth", () => {
    it("deletes both token and user keys", async () => {
      await clearAuth();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("barberpro_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("barberpro_user");
    });
  });
});
