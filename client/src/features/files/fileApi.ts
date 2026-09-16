import axiosClient from "../../lib/axiosClient";
import type { FileDTO } from "@shared/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchFiles(params?: {
  courseId?: string;
  chatId?: string;
}): Promise<FileDTO[]> {
  const response = await axiosClient.get<ApiResponse<FileDTO[]>>("/files", {
    params,
  });
  return response.data.data;
}

export async function uploadFile(
  file: File,
  meta?: { chatId?: string; courseId?: string; batchScope?: string },
): Promise<FileDTO> {
  const formData = new FormData();
  formData.append("file", file);

  if (meta?.chatId) formData.append("chatId", meta.chatId);
  if (meta?.courseId) formData.append("courseId", meta.courseId);
  if (meta?.batchScope) formData.append("batchScope", meta.batchScope);

  const response = await axiosClient.post<ApiResponse<FileDTO>>(
    "/files/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data.data;
}

export async function deleteFile(fileId: string): Promise<void> {
  await axiosClient.delete(`/files/${fileId}`);
}
