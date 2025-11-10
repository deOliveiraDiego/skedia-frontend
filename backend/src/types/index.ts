export interface Lead {
  id: number;
  name: string | null;
  phone: string;
  agent_active: boolean;
  email?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface ChatMessage {
  id: number;
  session_id: string;
  message: {
    type: 'ai' | 'human';
    content: string;
    tool_calls?: any[];
    additional_kwargs?: any;
    response_metadata?: any;
    invalid_tool_calls?: any[];
  };
  created_at: string;
}

export interface ContactListItem {
  id: number;
  name: string | null;
  phone: string;
  agent_active: boolean;
  last_message: string | null;
  last_message_time: string | null;
}

export interface ToggleAgentRequest {
  active: boolean;
}

export interface ToggleAgentResponse {
  success: boolean;
  agent_active: boolean;
}
