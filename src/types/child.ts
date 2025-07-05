export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string; // ISO string
  sentiment?: string; // optional: e.g., "positive", "neutral", "negative"
  recommendations?: string[]; // optional AI suggestions
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  sentiment?: string;
  recommendations?: string[];
}

export interface SendMessageRequest {
  message: string;
  child_id: number | null;
  context?: string;
}
