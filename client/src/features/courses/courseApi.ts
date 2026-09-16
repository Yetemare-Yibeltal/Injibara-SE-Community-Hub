import axiosClient from "../../lib/axiosClient";
import type { CourseDTO } from "@shared/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchCourses(): Promise<CourseDTO[]> {
  const response = await axiosClient.get<ApiResponse<CourseDTO[]>>("/courses");
  return response.data.data;
}

export async function fetchCourseById(courseId: string): Promise<CourseDTO> {
  const response = await axiosClient.get<ApiResponse<CourseDTO>>(
    `/courses/${courseId}`,
  );
  return response.data.data;
}
