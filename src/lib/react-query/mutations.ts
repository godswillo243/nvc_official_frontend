import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
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
  ApiError
} from "./actions/auth";

// Helper function to handle successful auth operations
const handleAuthSuccess = (queryClient: ReturnType<typeof useQueryClient>) => 
  (data: AuthResponse) => {
    queryClient.setQueryData(['auth'], data.user);
  };

export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  // Consolidated success handler for login/signup
  const authSuccessHandler = handleAuthSuccess(queryClient);

  const signupMutation = useMutation<AuthResponse, ApiError, UserSignupData>({
    mutationFn: signup,
    onSuccess: authSuccessHandler,
  });

  const loginMutation = useMutation<AuthResponse, ApiError, UserLoginData>({
    mutationFn: login,
    onSuccess: authSuccessHandler,
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });

  const logoutMutation = useMutation<void, ApiError, void>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.removeQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error('Logout failed:', error.message);
    },
  });

  const verifyEmailMutation = useMutation<void, ApiError, string>({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const requestPasswordResetMutation = useMutation<void, ApiError, string>({
    mutationFn: requestPasswordReset,
  });

  const resetPasswordMutation = useMutation<
    void,
    ApiError,
    { token: string; newPassword: string }
  >({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
  });

  const refreshTokenMutation = useMutation<AuthResponse, ApiError>({
    mutationFn: refreshToken,
    retry: 1,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Token refresh failed:', error.message);
    },
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

// Create independent hooks to avoid unnecessary dependency chains
export const useSignup = () => useMutation<AuthResponse, ApiError, UserSignupData>({
  mutationFn: signup,
  onSuccess: handleAuthSuccess(useQueryClient()),
});

export const useLogin = () => useMutation<AuthResponse, ApiError, UserLoginData>({
  mutationFn: login,
  onSuccess: handleAuthSuccess(useQueryClient()),
  onError: (error) => {
    console.error('Login failed:', error.message);
  },
});

export const useLogout = () => useMutation<void, ApiError, void>({
  mutationFn: logout,
  onSuccess: () => {
    const queryClient = useQueryClient();
    queryClient.clear();
    queryClient.removeQueries({ queryKey: ['auth'] });
  },
  onError: (error) => {
    console.error('Logout failed:', error.message);
  },
});

export const useVerifyEmail = () => useMutation<void, ApiError, string>({
  mutationFn: verifyEmail,
  onSuccess: () => {
    useQueryClient().invalidateQueries({ queryKey: ['auth'] });
  },
});

export const useRequestPasswordReset = () => 
  useMutation<void, ApiError, string>({
    mutationFn: requestPasswordReset,
  });

export const useResetPassword = () => 
  useMutation<void, ApiError, { token: string; newPassword: string }>({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
  });

export const useRefreshToken = () => 
  useMutation<AuthResponse, ApiError>({
    mutationFn: refreshToken,
    retry: 1,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Token refresh failed:', error.message);
    },
  });
