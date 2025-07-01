// src/services/api.ts
import axiosInstance from "../api/axiosInstance";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  name?: string;
  picture?: string;
  role: string;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: User }> => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return data;
};

export const register = async (
  email: string,
  password: string
): Promise<{ token: string; user: User }> => {
  const { data } = await axiosInstance.post("/auth/register", { email, password });
  return data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

// ─── Child Profiles ────────────────────────────────────────────────────────────

export interface ChildProfile {
  child_id: number;
  name: string;
  age: number;
  gender: "Male" | "Female";
  school?: string;
  challenges?: string;
}

export const getChildProfiles = async (): Promise<ChildProfile[]> => {
  const { data } = await axiosInstance.get("/auth/child");
  return data;
};

export const createChildProfile = async (
  profile: Omit<ChildProfile, "child_id">
): Promise<ChildProfile> => {
  const { data } = await axiosInstance.post("/auth/child", profile);
  return data;
};

export const updateChildProfile = async (
  childId: number,
  profile: Omit<ChildProfile, "child_id">
): Promise<ChildProfile> => {
  const { data } = await axiosInstance.put(`/auth/child/${childId}`, profile);
  return data;
};

export const deleteChildProfile = async (
  childId: number
): Promise<void> => {
  await axiosInstance.delete(`/auth/child/${childId}`);
};

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatHistoryEntry {
  id: number;
  user_input: string;
  chatbot_response: string;
  timestamp: string;
}

export const getChatHistory = async (
  childId: number
): Promise<ChatHistoryEntry[]> => {
  const { data } = await axiosInstance.get(`/chat/history/${childId}`);
  return data;
};

export const sendMessage = async (
  childId: number,
  message: string,
  context?: string
): Promise<{ response: string }> => {
  const { data } = await axiosInstance.post("/chat", {
    child_id: childId,
    message,
    context,
  });
  return data;
};
