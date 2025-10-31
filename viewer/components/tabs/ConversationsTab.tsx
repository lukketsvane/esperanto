import { useState } from 'react';
import { Conversation } from '@/lib/types';
import ConfidenceBar from '../ConfidenceBar';

interface ConversationsTabProps {
  conversations: Conversation[];
}

export default function ConversationsTab({ conversations }: ConversationsTabProps) {
  const [sortBy, setSortBy] = useState<keyof Conversation>('create_time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sortedConversations = [...conversations].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const multiplier = sortOrder === 'asc' ? 1 : -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return multiplier * aVal.localeCompare(bVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return multiplier * (aVal - bVal);
    }
    return 0;
  });

  const selected = sortedConversations[selectedIndex];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Conversation Browser</h2>

      {/* Sort Controls */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as keyof Conversation)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="create_time">Create Time</option>
            <option value="match_confidence">Confidence</option>
            <option value="user_msg_count">User Messages</option>
            <option value="assistant_msg_count">Assistant Messages</option>
            <option value="conv_title">Title</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Order:</label>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setSortOrder('desc')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                sortOrder === 'desc'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              Descending
            </button>
            <button
              onClick={() => setSortOrder('asc')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                sortOrder === 'asc'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-l-0 border-gray-300`}
            >
              Ascending
            </button>
          </div>
        </div>
      </div>

      {/* Conversations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folder</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Index</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Msgs</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asst Msgs</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedConversations.map((conv, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedIndex === idx ? 'bg-blue-100' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{conv.folder}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{conv.conv_index}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                    {conv.conv_title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono text-xs">
                    {conv.matched_participant_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{conv.match_method}</td>
                  <td className="px-4 py-3">
                    <div className="w-32">
                      <ConfidenceBar confidence={conv.match_confidence} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{conv.user_msg_count}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{conv.assistant_msg_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversation Details */}
      {selected && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Details</h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Folder</p>
              <p className="text-lg font-medium text-gray-900">{selected.folder}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Participant ID</p>
              <p className="text-lg font-medium text-gray-900 font-mono text-sm">
                {selected.matched_participant_id}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-medium text-gray-900">{selected.create_dt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Match Method</p>
              <p className="text-lg font-medium text-gray-900">{selected.match_method}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Confidence</p>
              <p className="text-lg font-medium text-gray-900">{selected.match_confidence.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Messages</p>
              <p className="text-lg font-medium text-gray-900">
                {selected.user_msg_count + selected.assistant_msg_count}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Title</p>
              <p className="text-gray-900">{selected.conv_title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">First Message</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{selected.first_user_msg}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
