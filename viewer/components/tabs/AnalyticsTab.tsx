import { Conversation } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface AnalyticsTabProps {
  conversations: Conversation[];
}

export default function AnalyticsTab({ conversations }: AnalyticsTabProps) {
  // Confidence tiers
  const tiers = [
    { label: '0.95-1.00 (Excellent)', min: 0.95, max: 1.0 },
    { label: '0.80-0.94 (High)', min: 0.80, max: 0.95 },
    { label: '0.60-0.79 (Medium)', min: 0.60, max: 0.80 },
    { label: '0.40-0.59 (Low)', min: 0.40, max: 0.60 },
    { label: '0.01-0.39 (Very Low)', min: 0.01, max: 0.40 },
    { label: '0.00 (Unmatched)', min: 0.0, max: 0.0 },
  ];

  const tierData = tiers.map(tier => {
    const count = conversations.filter(c =>
      tier.min === tier.max
        ? c.match_confidence === tier.min
        : c.match_confidence >= tier.min && c.match_confidence < tier.max
    ).length;
    const percentage = ((count / conversations.length) * 100).toFixed(1);
    return { ...tier, count, percentage };
  });

  // Message statistics
  const totalUserMsgs = conversations.reduce((sum, c) => sum + c.user_msg_count, 0);
  const totalAssistantMsgs = conversations.reduce((sum, c) => sum + c.assistant_msg_count, 0);
  const avgUserMsgs = (totalUserMsgs / conversations.length).toFixed(2);
  const avgAssistantMsgs = (totalAssistantMsgs / conversations.length).toFixed(2);

  // Temporal distribution
  const dateGroups = conversations.reduce((acc, conv) => {
    const dateStr = conv.create_dt;
    if (!acc[dateStr]) {
      acc[dateStr] = 0;
    }
    acc[dateStr]++;
    return acc;
  }, {} as Record<string, number>);

  const temporalData = Object.entries(dateGroups)
    .map(([date, count]) => ({
      date: format(
        parseISO(date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
        'MMM dd, yyyy'
      ),
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confidence Score Tiers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Score Tiers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tier</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Count</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tierData.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{tier.label}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">
                      {tier.count}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {tier.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total User Messages</span>
              <span className="text-2xl font-bold text-blue-600">{totalUserMsgs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Assistant Messages</span>
              <span className="text-2xl font-bold text-green-600">{totalAssistantMsgs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Avg User Msgs/Conv</span>
              <span className="text-2xl font-bold text-purple-600">{avgUserMsgs}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Avg Assistant Msgs/Conv</span>
              <span className="text-2xl font-bold text-orange-600">{avgAssistantMsgs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Temporal Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversations Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={temporalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
