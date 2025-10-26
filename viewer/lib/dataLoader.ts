import { Conversation, ParticipantSummary } from './types';

export async function loadConversations(): Promise<Conversation[]> {
  try {
    const response = await fetch('/data/matched_conversations.json');
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
}

export function filterConversations(
  conversations: Conversation[],
  folder: string,
  matchMethod: string,
  minConfidence: number
): Conversation[] {
  return conversations.filter(conv => {
    const folderMatch = folder === 'All' || conv.folder === folder;
    const methodMatch = matchMethod === 'All' || conv.match_method === matchMethod;
    const confidenceMatch = conv.match_confidence >= minConfidence;
    return folderMatch && methodMatch && confidenceMatch;
  });
}

export function buildParticipantSummary(conversations: Conversation[]): ParticipantSummary[] {
  const participantMap = new Map<string, ParticipantSummary>();

  conversations.forEach(conv => {
    const pid = conv.matched_participant_id;
    if (!pid) return;

    if (!participantMap.has(pid)) {
      participantMap.set(pid, {
        participant_id: pid,
        conversation_count: 0,
        total_user_messages: 0,
        total_assistant_messages: 0,
        avg_confidence: 0,
        folders: []
      });
    }

    const summary = participantMap.get(pid)!;
    summary.conversation_count++;
    summary.total_user_messages += conv.user_msg_count;
    summary.total_assistant_messages += conv.assistant_msg_count;

    if (!summary.folders.includes(conv.folder)) {
      summary.folders.push(conv.folder);
    }
  });

  // Calculate average confidence
  participantMap.forEach((summary, pid) => {
    const participantConvs = conversations.filter(c => c.matched_participant_id === pid);
    const totalConfidence = participantConvs.reduce((sum, c) => sum + c.match_confidence, 0);
    summary.avg_confidence = totalConfidence / participantConvs.length;
    summary.folders.sort();
  });

  return Array.from(participantMap.values())
    .sort((a, b) => b.conversation_count - a.conversation_count);
}

export function getUniqueValues<T>(items: T[], key: keyof T): string[] {
  const values = new Set<string>();
  items.forEach(item => {
    const value = item[key];
    if (typeof value === 'string') {
      values.add(value);
    }
  });
  return Array.from(values).sort();
}

export function searchConversations(
  conversations: Conversation[],
  searchTerm: string,
  searchType: 'title' | 'message' | 'participant'
): Conversation[] {
  if (!searchTerm) return conversations;

  const term = searchTerm.toLowerCase();
  return conversations.filter(conv => {
    switch (searchType) {
      case 'title':
        return conv.conv_title.toLowerCase().includes(term);
      case 'message':
        return conv.first_user_msg?.toLowerCase().includes(term);
      case 'participant':
        return conv.matched_participant_id?.toLowerCase().includes(term);
      default:
        return false;
    }
  });
}
