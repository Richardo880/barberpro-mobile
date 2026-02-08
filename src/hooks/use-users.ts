import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";
import Toast from "react-native-toast-message";

interface UpdateProfileData {
  name?: string;
  phone?: string;
  birthDate?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return apiClient(`/api/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      Toast.show({
        type: "success",
        text1: "Perfil actualizado",
        text2: "Tu perfil ha sido actualizado exitosamente",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });
}

export function useChangePassword(userId: string) {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      return apiClient(`/api/users/${userId}/password`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Contraseña actualizada",
        text2: "Tu contraseña ha sido cambiada exitosamente",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });
}
