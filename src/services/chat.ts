import apiClient from "@/services/api";
import { ChatMessage } from "@/types/chat";

export const sendMessage = async (token: string, message: string, childId: number) => {
  const response = await apiClient.post("/api/auth/chat", {
    message,
    child_id: childId
  });

  return {
    id: response.data.id,
    text: response.data.response,
    fromChild: false,
    timestamp: response.data.timestamp
  };
};


export const getChatHistory = async (token: string, childId: number) => {
  const response = await apiClient.get(`/api/auth/chat/history/${childId}`);
  return response.data.messages || [];
};