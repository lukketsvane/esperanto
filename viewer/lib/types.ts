export interface Conversation {
  folder: string;
  conv_index: number;
  conv_title: string;
  matched_participant_id: string | null;
  match_method: string;
  match_confidence: number;
  create_dt: string;
  create_time: string;
  user_msg_count: number;
  assistant_msg_count: number;
  total_user_chars: number;
  total_assistant_chars: number;
  first_user_msg: string | null;
}

export interface Filters {
  folder: string;
  matchMethod: string;
  minConfidence: number;
}

export interface ParticipantSummary {
  participant_id: string;
  conversation_count: number;
  total_user_messages: number;
  total_assistant_messages: number;
  avg_confidence: number;
  folders: string[];
}
