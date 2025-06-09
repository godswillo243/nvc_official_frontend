import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  signup,
  logout,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  type AuthResponse,
  type UserSignupData,
  type UserLoginData,
  type ApiError,
} from "./actions/auth";

// Helper function to handle successful auth operations
const handleAuthSuccess = (queryClient: ReturnType<typeof useQueryClient>) =>
  (data: AuthResponse) => {
    queryClient.setQueryData(['auth'], data.user);
  };

export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, ApiError, UserSignupData>({
    mutationFn: signup,
    onSuccess: handleAuthSuccess(queryClient),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, ApiError, UserLoginData>({
    mutationFn: login,
    onSuccess: handleAuthSuccess(queryClient),
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, void>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.removeQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error('Logout failed:', error.message);
    },
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useRequestPasswordReset = () =>
  useMutation<void, ApiError, string>({
    mutationFn: requestPasswordReset,
  });

export const useResetPassword = () =>
  useMutation<void, ApiError, { token: string; newPassword: string }>({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
  });

export const useRefreshToken = () =>
  useMutation<boolean, ApiError>({
    mutationFn: refreshToken,
    retry: 1,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Token refresh failed:', error.message);
    },
  });
