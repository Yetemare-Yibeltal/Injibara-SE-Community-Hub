import axiosClient from "../../lib/axiosClient";
import type { ChatDTO } from "@shared/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function createGroup(
  name: string,
  memberIds: string[],
): Promise<ChatDTO> {
  const response = await axiosClient.post<ApiResponse<ChatDTO>>("/chats", {
    name,
    memberIds,
  });
  return response.data.data;
}

export async function addGroupMembers(
  chatId: string,
  memberIds: string[],
): Promise<ChatDTO> {
  const response = await axiosClient.post<ApiResponse<ChatDTO>>(
    `/chats/${chatId}/members`,
    {
      memberIds,
    },
  );
  return response.data.data;
}

export async function removeGroupMember(
  chatId: string,
  userId: string,
): Promise<ChatDTO> {
  const response = await axiosClient.delete<ApiResponse<ChatDTO>>(
    `/chats/${chatId}/members/${userId}`,
  );
  return response.data.data;
}

export async function leaveGroup(chatId: string): Promise<void> {
  await axiosClient.post(`/chats/${chatId}/leave`);
}

export async function renameGroup(
  chatId: string,
  name: string,
): Promise<ChatDTO> {
  const response = await axiosClient.patch<ApiResponse<ChatDTO>>(
    `/chats/${chatId}/rename`,
    {
      name,
    },
  );
  return response.data.data;
}
