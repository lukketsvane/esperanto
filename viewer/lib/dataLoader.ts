import { Conversation, RawConversation, ParticipantSummary, Stats, MessageNode } from './types';

function confidenceToLabel(conf: number): string {
  if (conf >= 0.90) return 'high';
  if (conf >= 0.70) return 'medium';
  return 'low';
}

function extractMessageCounts(mapping: Record<string, MessageNode>): {
  userCount: number;
  assistantCount: number;
  firstUserMessage: string;
} {
  let userCount = 0;
  let assistantCount = 0;
  let firstUserMessage = '';

  for (const node of Object.values(mapping)) {
    if (node.message && node.message.author) {
      const role = node.message.author.role;

      if (role === 'user') {
        userCount++;
        if (!firstUserMessage && node.message.content?.parts?.[0]) {
          firstUserMessage = String(node.message.content.parts[0]).substring(0, 200);
        }
      } else if (role === 'assistant') {
        assistantCount++;
      }
    }
  }

  return { userCount, assistantCount, firstUserMessage };
}

function normalizeConfidence(conf: string | number | undefined): number {
  if (conf === undefined || conf === null) return 1.0;

  if (typeof conf === 'string') {
    // Already a string like 'high', 'medium', 'low'
    if (conf.toLowerCase() === 'high') return 0.95;
    if (conf.toLowerCase() === 'medium') return 0.75;
    if (conf.toLowerCase() === 'low') return 0.5;

    // Try to parse as number
    const num = parseFloat(conf);
    if (isNaN(num)) return 1.0;
    return num;
  }

  if (typeof conf === 'number') {
    return conf;
  }

  return 1.0;
}

export async function loadConversations(): Promise<Conversation[]> {
  try {
    const response = await fetch('/data/matched_conversations.json');
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    const rawData: RawConversation[] = await response.json();

    // Transform raw data to our format
    return rawData.map(raw => {
      const { userCount, assistantCount, firstUserMessage } = extractMessageCounts(raw.mapping || {});
      const createDate = new Date(raw.create_time * 1000);

      return {
        conversation_id: raw.conversation_id,
        title: raw.title,
        participant_id: raw.participant_id || null,
        source_folder: raw.source_folder,
        match_method: raw.match_method || 'explicit_id',
        match_confidence: normalizeConfidence(raw.match_confidence),
        match_time_diff_minutes: raw.match_time_diff_minutes,
        create_time: raw.create_time,
        create_time_str: createDate.toLocaleString(),
        create_date: createDate.toISOString().split('T')[0],
        update_time: raw.update_time,
        user_msg_count: userCount,
        assistant_msg_count: assistantCount,
        total_messages: userCount + assistantCount,
        first_user_message: firstUserMessage,
        mapping: raw.mapping || {}
      };
    });
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
}

export function filterConversations(
  conversations: Conversation[],
  filters: {
    folder?: string;
    matchMethod?: string;
    matchConfidence?: string;
    participantId?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Conversation[] {
  return conversations.filter(conv => {
    // Folder filter
    if (filters.folder && filters.folder !== 'All' && conv.source_folder !== filters.folder) {
      return false;
    }

    // Match method filter
    if (filters.matchMethod && filters.matchMethod !== 'All' && conv.match_method !== filters.matchMethod) {
      return false;
    }

    // Match confidence filter
    if (filters.matchConfidence && filters.matchConfidence !== 'All') {
      const conf = conv.match_confidence;
      if (filters.matchConfidence === 'high' && conf < 0.90) return false;
      if (filters.matchConfidence === 'medium' && (conf < 0.70 || conf >= 0.90)) return false;
      if (filters.matchConfidence === 'low' && conf >= 0.70) return false;
    }

    // Participant ID filter
    if (filters.participantId && filters.participantId !== 'All' && conv.participant_id !== filters.participantId) {
      return false;
    }

    // Date filters
    if (filters.dateFrom && conv.create_date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && conv.create_date > filters.dateTo) {
      return false;
    }

    return true;
  });
}

export function buildParticipantSummary(conversations: Conversation[]): ParticipantSummary[] {
  const participantMap = new Map<string, { summary: ParticipantSummary; totalConfidence: number }>();

  conversations.forEach(conv => {
    const pid = conv.participant_id;
    if (!pid) return;

    if (!participantMap.has(pid)) {
      participantMap.set(pid, {
        summary: {
          participant_id: pid,
          conversation_count: 0,
          total_user_messages: 0,
          total_assistant_messages: 0,
          match_methods: {},
          confidence_breakdown: {},
          avg_confidence: 0,
          folders: [],
          earliest_conversation: conv.create_time_str,
          latest_conversation: conv.create_time_str
        },
        totalConfidence: 0
      });
    }

    const data = participantMap.get(pid)!;
    const summary = data.summary;
    summary.conversation_count++;
    summary.total_user_messages += conv.user_msg_count;
    summary.total_assistant_messages += conv.assistant_msg_count;
    data.totalConfidence += conv.match_confidence;

    // Track match methods
    summary.match_methods[conv.match_method] = (summary.match_methods[conv.match_method] || 0) + 1;

    // Track confidence levels
    const confLabel = confidenceToLabel(conv.match_confidence);
    summary.confidence_breakdown[confLabel] = (summary.confidence_breakdown[confLabel] || 0) + 1;

    // Track folders
    if (!summary.folders.includes(conv.source_folder)) {
      summary.folders.push(conv.source_folder);
    }

    // Track earliest and latest
    if (conv.create_time_str < summary.earliest_conversation) {
      summary.earliest_conversation = conv.create_time_str;
    }
    if (conv.create_time_str > summary.latest_conversation) {
      summary.latest_conversation = conv.create_time_str;
    }
  });

  return Array.from(participantMap.values())
    .map(({ summary, totalConfidence }) => ({
      ...summary,
      avg_confidence: summary.conversation_count > 0 ? totalConfidence / summary.conversation_count : 0
    }))
    .sort((a, b) => b.conversation_count - a.conversation_count);
}

export function calculateStats(conversations: Conversation[]): Stats {
  const stats: Stats = {
    total_conversations: conversations.length,
    total_participants: new Set(conversations.map(c => c.participant_id).filter(Boolean)).size,
    total_folders: new Set(conversations.map(c => c.source_folder)).size,
    total_messages: conversations.reduce((sum, c) => sum + c.total_messages, 0),
    match_methods: {},
    confidence_levels: {},
    conversations_by_date: {}
  };

  conversations.forEach(conv => {
    // Count match methods
    stats.match_methods[conv.match_method] = (stats.match_methods[conv.match_method] || 0) + 1;

    // Count confidence levels
    const confLabel = confidenceToLabel(conv.match_confidence);
    stats.confidence_levels[confLabel] = (stats.confidence_levels[confLabel] || 0) + 1;

    // Count by date
    stats.conversations_by_date[conv.create_date] = (stats.conversations_by_date[conv.create_date] || 0) + 1;
  });

  return stats;
}

export function getUniqueValues<T>(items: T[], key: keyof T): string[] {
  const values = new Set<string>();
  items.forEach(item => {
    const value = item[key];
    if (typeof value === 'string') {
      values.add(value);
    }
  });
  return ['All', ...Array.from(values).sort()];
}

export function searchConversations(
  conversations: Conversation[],
  searchTerm: string,
  searchType: 'title' | 'message' | 'participant' | 'all'
): Conversation[] {
  if (!searchTerm) return conversations;

  const term = searchTerm.toLowerCase();
  return conversations.filter(conv => {
    switch (searchType) {
      case 'title':
        return conv.title.toLowerCase().includes(term);
      case 'message':
        return conv.first_user_message?.toLowerCase().includes(term);
      case 'participant':
        return conv.participant_id?.toLowerCase().includes(term);
      case 'all':
        return (
          conv.title.toLowerCase().includes(term) ||
          conv.first_user_message?.toLowerCase().includes(term) ||
          conv.participant_id?.toLowerCase().includes(term) ||
          conv.conversation_id.toLowerCase().includes(term)
        );
      default:
        return false;
    }
  });
}

export function exportToCSV(conversations: Conversation[]): string {
  const headers = [
    'Conversation ID',
    'Title',
    'Participant ID',
    'Source Folder',
    'Match Method',
    'Match Confidence',
    'Time Diff (min)',
    'Create Time',
    'User Messages',
    'Assistant Messages',
    'Total Messages'
  ];

  const rows = conversations.map(conv => [
    conv.conversation_id,
    `"${conv.title.replace(/"/g, '""')}"`,
    conv.participant_id || '',
    conv.source_folder,
    conv.match_method,
    conv.match_confidence,
    conv.match_time_diff_minutes?.toString() || '',
    conv.create_time_str,
    conv.user_msg_count.toString(),
    conv.assistant_msg_count.toString(),
    conv.total_messages.toString()
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
