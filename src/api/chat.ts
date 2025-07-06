// src/api/chat.ts
export interface FetchChatResponseInput {
  user_input: string;
  child_id: number;
  child_age: number;
  child_name: string;
  context?: string;
}

export interface AIResponse {
  response: string;
  sentiment: string;
  sentiment_score: number;
  suggested_actions: string[];
}

export async function fetchChatResponse(input: FetchChatResponseInput): Promise<AIResponse> {
  const res = await fetch('/api/auth/chat/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI error: ${res.status} ${text}`);
  }

  return res.json();
}
