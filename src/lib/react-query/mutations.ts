import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./actions/auth";

export const useSignup = () =>
  useMutation({
    mutationFn: signup,
  });
export const useLogin = () =>
  useMutation({
    mutationFn: login,
  });
