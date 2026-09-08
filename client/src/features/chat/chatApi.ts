import axiosClient from "../../lib/axiosClient";
import type { ChatDTO, MessageDTO } from "@shared/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ChatWithUnreadCount {
  chat: ChatDTO;
  unreadCount: number;
}

export async function fetchChats(): Promise<ChatWithUnreadCount[]> {
  const response =
    await axiosClient.get<ApiResponse<ChatWithUnreadCount[]>>("/chats");
  return response.data.data;
}

export async function fetchChatById(chatId: string): Promise<ChatDTO> {
  const response = await axiosClient.get<ApiResponse<ChatDTO>>(
    `/chats/${chatId}`,
  );
  return response.data.data;
}

export async function createChat(
  name: string,
  memberIds: string[],
): Promise<ChatDTO> {
  const response = await axiosClient.post<ApiResponse<ChatDTO>>("/chats", {
    name,
    memberIds,
  });
  return response.data.data;
}

export async function archiveChat(chatId: string): Promise<ChatDTO> {
  const response = await axiosClient.patch<ApiResponse<ChatDTO>>(
    `/chats/${chatId}/archive`,
  );
  return response.data.data;
}

export async function toggleMuteChat(chatId: string): Promise<ChatDTO> {
  const response = await axiosClient.patch<ApiResponse<ChatDTO>>(
    `/chats/${chatId}/mute`,
  );
  return response.data.data;
}

export async function fetchMessages(
  chatId: string,
  before?: string,
): Promise<MessageDTO[]> {
  const response = await axiosClient.get<ApiResponse<MessageDTO[]>>(
    `/messages/${chatId}`,
    {
      params: before ? { before } : undefined,
    },
  );
  return response.data.data;
}

export async function editMessage(
  messageId: string,
  content: string,
): Promise<MessageDTO> {
  const response = await axiosClient.patch<ApiResponse<MessageDTO>>(
    `/messages/${messageId}`,
    {
      content,
    },
  );
  return response.data.data;
}

export async function deleteMessage(messageId: string): Promise<MessageDTO> {
  const response = await axiosClient.delete<ApiResponse<MessageDTO>>(
    `/messages/${messageId}`,
  );
  return response.data.data;
}

export async function reactToMessage(
  messageId: string,
  emoji: string,
): Promise<MessageDTO> {
  const response = await axiosClient.post<ApiResponse<MessageDTO>>(
    `/messages/${messageId}/react`,
    {
      emoji,
    },
  );
  return response.data.data;
}
