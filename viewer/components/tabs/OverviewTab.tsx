import { Conversation } from '@/lib/types';
import MetricCard from '../MetricCard';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface OverviewTabProps {
  conversations: Conversation[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function OverviewTab({ conversations }: OverviewTabProps) {
  const totalConversations = conversations.length;
  const matched = conversations.filter(c => c.match_method !== 'unmatched').length;
  const uniqueParticipants = new Set(conversations.map(c => c.participant_id)).size;
  const uniqueFolders = new Set(conversations.map(c => c.source_folder)).size;
  const highConfidence = conversations.filter(c => c.match_confidence >= 0.80).length;

  // Match method distribution
  const methodCounts = conversations.reduce((acc, conv) => {
    acc[conv.match_method] = (acc[conv.match_method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const methodData = Object.entries(methodCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Conversations by folder
  const folderCounts = conversations.reduce((acc, conv) => {
    acc[conv.source_folder] = (acc[conv.source_folder] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const folderData = Object.entries(folderCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Confidence distribution
  const confidenceBuckets = [
    { range: '0.95-1.00', min: 0.95, max: 1.0 },
    { range: '0.80-0.94', min: 0.80, max: 0.95 },
    { range: '0.60-0.79', min: 0.60, max: 0.80 },
    { range: '0.40-0.59', min: 0.40, max: 0.60 },
    { range: '0.01-0.39', min: 0.01, max: 0.40 },
    { range: '0.00', min: 0, max: 0 },
  ];

  const confidenceData = confidenceBuckets.map(bucket => ({
    range: bucket.range,
    count: conversations.filter(c =>
      bucket.min === bucket.max
        ? c.match_confidence === bucket.min
        : c.match_confidence >= bucket.min && c.match_confidence < bucket.max
    ).length,
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dataset Overview</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="📄 Total Conversations"
          value={totalConversations.toLocaleString()}
          delta={`${(matched / totalConversations * 100).toFixed(1)}% matched`}
        />
        <MetricCard
          label="👥 Unique Participants"
          value={uniqueParticipants.toLocaleString()}
          delta={`${(matched / uniqueParticipants).toFixed(1)} avg convs/participant`}
        />
        <MetricCard
          label="📁 Study Folders"
          value={uniqueFolders}
          delta={`${(totalConversations / uniqueFolders).toFixed(1)} avg convs/folder`}
        />
        <MetricCard
          label="✅ High Confidence"
          value={highConfidence.toLocaleString()}
          delta={`${(highConfidence / totalConversations * 100).toFixed(1)}%`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match Method Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Method Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={methodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {methodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversations by Folder */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversations per Study Folder</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={folderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
