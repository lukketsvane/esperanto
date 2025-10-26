import { useMemo } from 'react';
import { Conversation } from '@/lib/types';
import { buildParticipantSummary } from '@/lib/dataLoader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ParticipantsTabProps {
  conversations: Conversation[];
}

export default function ParticipantsTab({ conversations }: ParticipantsTabProps) {
  const participantSummary = useMemo(
    () => buildParticipantSummary(conversations),
    [conversations]
  );

  const top20 = participantSummary.slice(0, 20);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Participant Analysis</h2>

      {/* Participant Summary Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Participant ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Conversations
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User Messages
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assistant Messages
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avg Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Folders
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participantSummary.map((p) => (
                <tr key={p.participant_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-xs text-gray-900">
                    {p.participant_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium text-center">
                    {p.conversation_count}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    {p.total_user_messages}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    {p.total_assistant_messages}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    {p.avg_confidence.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.folders.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 20 Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 20 Most Active Participants
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={top20} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="participant_id"
              width={150}
              tick={{ fontSize: 10 }}
            />
            <Tooltip />
            <Bar dataKey="conversation_count" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
