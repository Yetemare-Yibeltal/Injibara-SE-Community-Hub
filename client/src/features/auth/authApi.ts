import axiosClient from "../../lib/axiosClient";
import type { LoginInput } from "@shared/validation/auth.schema";
import type { AccountDTO } from "@shared/types";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AccountDTO;
  };
}

export async function loginRequest(input: LoginInput): Promise<LoginResponse> {
  const response = await axiosClient.post<LoginResponse>("/auth/login", input);
  return response.data;
}

export async function logoutRequest(): Promise<void> {
  await axiosClient.post("/auth/logout");
}

export async function refreshTokenRequest(): Promise<{ accessToken: string }> {
  const response = await axiosClient.post<{
    success: boolean;
    message: string;
    data: { accessToken: string };
  }>("/auth/refresh");
  return response.data.data;
}
