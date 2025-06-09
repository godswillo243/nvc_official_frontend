import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  signup,
  logout,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  AuthResponse,
  UserSignupData,
  UserLoginData,
  ApiError,
} from "./actions/auth";

export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  const signupMutation = useMutation<AuthResponse, ApiError, UserSignupData>({
    mutationFn: signup,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data.user);
    },
  });

  const loginMutation = useMutation<AuthResponse, ApiError, UserLoginData>({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data.user);
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.removeQueries(['auth']);
    },
    onError: (error: ApiError) => {
      console.error('Logout failed:', error.message);
    },
  });

  const verifyEmailMutation = useMutation<void, ApiError, string>({
    mutationFn: (token) => verifyEmail(token),
    onSuccess: () => {
      queryClient.invalidateQueries(['auth']);
    },
  });

  const requestPasswordResetMutation = useMutation<void, ApiError, string>({
    mutationFn: (email) => requestPasswordReset(email),
  });

  const resetPasswordMutation = useMutation<
    void,
    ApiError,
    { token: string; newPassword: string }
  >({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
  });

  const refreshTokenMutation = useMutation({
    mutationFn: refreshToken,
    retry: 1,
    retryDelay: 1000,
  });

  return {
    signup: signupMutation,
    login: loginMutation,
    logout: logoutMutation,
    verifyEmail: verifyEmailMutation,
    requestPasswordReset: requestPasswordResetMutation,
    resetPassword: resetPasswordMutation,
    refreshToken: refreshTokenMutation,
  };
};

// Individual hook exports for convenience
export const useSignup = () => useAuthMutations().signup;
export const useLogin = () => useAuthMutations().login;
export const useLogout = () => useAuthMutations().logout;
export const useVerifyEmail = () => useAuthMutations().verifyEmail;
export const useRequestPasswordReset = () => useAuthMutations().requestPasswordReset;
export const useResetPassword = () => useAuthMutations().resetPassword;
export const useRefreshToken = () => useAuthMutations().refreshToken;
