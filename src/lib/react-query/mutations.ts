import { useMutation } from "@tanstack/react-query";
import { signup } from "./actions/auth";

export const useSignup = () =>
  useMutation({
    mutationFn: signup,
  });
