import axiosClient from "../../lib/axiosClient";
import type { UserProfile } from "@shared/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function updateProfile(
  updates: Partial<UserProfile>,
): Promise<UserProfile> {
  const response = await axiosClient.patch<ApiResponse<UserProfile>>(
    "/users/me/profile",
    updates,
  );
  return response.data.data;
}
