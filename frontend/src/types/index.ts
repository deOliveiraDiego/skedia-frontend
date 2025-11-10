export interface Contact {
  id: number;
  name: string | null;
  phone: string;
  agent_active: boolean;
  last_message: string | null;
  last_message_time: string | null;
}

export interface Message {
  id: number;
  session_id: string;
  message: {
    type: 'ai' | 'human';
    content: string;
  };
  created_at: string;
}

export interface ToggleAgentResponse {
  success: boolean;
  agent_active: boolean;
}
