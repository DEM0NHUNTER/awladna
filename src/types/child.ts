export type ChatRole = "user" | "assistant";

// Reuse the structure from AuthContext
export interface ChildProfile {
  child_id: number;
  name: string;
  age: number;
  gender: "male" | "female" | string;
}

// Who is sending the message
export type ChatRole = "user" | "assistant";

// Message structure
export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string; // ISO 8601 string
  sentiment?: string;
  recommendations?: string[];
  child?: ChildProfile; // optional, enriched with child info
}

// What the server sends back
export interface ChatResponse {
  response: string;
  timestamp: string;
  sentiment?: string;
  recommendations?: string[];
}

// What we send to the server
export interface SendMessageRequest {
  message: string;
  child_id: number;
  context?: string;
}

