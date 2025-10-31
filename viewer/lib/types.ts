export interface Message {
  id: string;
  author: {
    role: string;
    name?: string | null;
    metadata?: Record<string, any>;
  };
  create_time: number | null;
  content: {
    content_type: string;
    parts: string[];
  };
  status?: string;
  end_turn?: boolean;
  weight?: number;
  metadata?: Record<string, any>;
  recipient?: string;
}

export interface MessageNode {
  id: string;
  message: Message | null;
  parent: string | null;
  children: string[];
}

export interface RawConversation {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, MessageNode>;
  moderation_results: any[];
  current_node: string | null;
  plugin_ids: string[] | null;
  conversation_id: string;
  conversation_template_id: string | null;
  gizmo_id: string | null;
  is_archived: boolean;
  safe_urls: string[];
  default_model_slug: string | null;
  source_folder: string;
  participant_id?: string | null;
  match_method?: string;
  match_confidence?: string | number;
  match_time_diff_minutes?: number;
}

export interface Conversation {
  conversation_id: string;
  title: string;
  participant_id: string | null;
  source_folder: string;
  match_method: string;
  match_confidence: number; // numeric confidence value between 0 and 1
  match_time_diff_minutes?: number;
  create_time: number;
  create_time_str: string;
  create_date: string;
  update_time: number;
  user_msg_count: number;
  assistant_msg_count: number;
  total_messages: number;
  first_user_message: string;
  mapping: Record<string, MessageNode>;
}

export interface Filters {
  folder: string;
  matchMethod: string;
  matchConfidence: string;
  participantId: string;
  dateFrom: string;
  dateTo: string;
}

export interface ParticipantSummary {
  participant_id: string;
  conversation_count: number;
  total_user_messages: number;
  total_assistant_messages: number;
  match_methods: Record<string, number>;
  confidence_breakdown: Record<string, number>;
  avg_confidence: number;
  folders: string[];
  earliest_conversation: string;
  latest_conversation: string;
}

export interface Stats {
  total_conversations: number;
  total_participants: number;
  total_folders: number;
  total_messages: number;
  match_methods: Record<string, number>;
  confidence_levels: Record<string, number>;
  conversations_by_date: Record<string, number>;
}
