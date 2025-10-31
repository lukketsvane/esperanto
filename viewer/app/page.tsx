'use client';

import { useEffect, useState } from 'react';
import { Conversation, Filters } from '@/lib/types';
import { loadConversations, filterConversations, getUniqueValues, calculateStats } from '@/lib/dataLoader';
import FilterSidebar from '@/components/FilterSidebar';
import TabNavigation from '@/components/TabNavigation';
import OverviewTab from '@/components/tabs/OverviewTab';
import ConversationsTab from '@/components/tabs/ConversationsTab';
import ParticipantsTab from '@/components/tabs/ParticipantsTab';
import AnalyticsTab from '@/components/tabs/AnalyticsTab';
import SearchTab from '@/components/tabs/SearchTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'conversations', label: 'Conversations', icon: '💬' },
  { id: 'participants', label: 'Participants', icon: '👥' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'search', label: 'Search', icon: '🔎' },
];

export default function Home() {
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [filteredConvs, setFilteredConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<Filters>({
    folder: 'All',
    matchMethod: 'All',
    matchConfidence: 'All',
    participantId: 'All',
    dateFrom: '',
    dateTo: '',
  });

  const [folders, setFolders] = useState<string[]>([]);
  const [matchMethods, setMatchMethods] = useState<string[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await loadConversations();

        if (data.length === 0) {
          setError(
            'No data found. Please ensure the data file is available at /public/data/matched_conversations.json'
          );
          return;
        }

        setAllConversations(data);
        setFilteredConvs(data);
        setFolders(getUniqueValues(data, 'source_folder'));
        setMatchMethods(getUniqueValues(data, 'match_method'));

        // Get unique participants
        const uniqueParticipants = ['All', ...Array.from(new Set(
          data.map(c => c.participant_id).filter(Boolean) as string[]
        )).sort()];
        setParticipants(uniqueParticipants);

      } catch (err) {
        setError('Failed to load data. Please check the console for details.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (allConversations.length === 0) return;

    const filtered = filterConversations(allConversations, filters);
    setFilteredConvs(filtered);
  }, [filters, allConversations]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-700 text-xl font-medium">Loading Esperanto data...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚠️</span>
            <h2 className="text-red-800 text-2xl font-bold">Error Loading Data</h2>
          </div>
          <p className="text-red-700 mb-6">{error}</p>
          <div className="mt-6 bg-white rounded-lg p-6 text-sm text-gray-700">
            <p className="font-semibold mb-3 text-lg">To fix this:</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Ensure you&apos;re in the <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">viewer</code> directory</li>
              <li>Create <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">public/data</code> directory if it doesn&apos;t exist</li>
              <li>Copy the matched conversations file to <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">public/data/matched_conversations.json</code></li>
              <li>Refresh this page</li>
            </ol>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="font-mono text-xs">
                <span className="text-blue-700">$ </span>cp ../output/all_matched_conversations.json public/data/matched_conversations.json
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStats(filteredConvs);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl">
        <div className="px-8 py-6">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            📊 Esperanto Study Data Viewer
          </h1>
          <p className="text-blue-100 mt-2 text-lg">
            Interactive viewer for ChatGPT conversation dataset · {stats.total_conversations.toLocaleString()} conversations · {stats.total_participants} participants
          </p>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          folders={folders}
          matchMethods={matchMethods}
          participants={participants}
          totalCount={allConversations.length}
          filteredCount={filteredConvs.length}
          onFilterChange={setFilters}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Tab Navigation */}
          <TabNavigation
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          <div className="flex-1 bg-gray-50">
            {activeTab === 'overview' && <OverviewTab conversations={filteredConvs} />}
            {activeTab === 'conversations' && <ConversationsTab conversations={filteredConvs} />}
            {activeTab === 'participants' && <ParticipantsTab conversations={filteredConvs} />}
            {activeTab === 'analytics' && <AnalyticsTab conversations={filteredConvs} />}
            {activeTab === 'search' && <SearchTab conversations={filteredConvs} />}
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 px-8 py-4 text-center text-sm text-gray-600">
            <p>
              <strong className="text-blue-700">Esperanto Study Data Viewer</strong> ·
              Showing <span className="font-semibold text-gray-900">{filteredConvs.length.toLocaleString()}</span> of <span className="font-semibold text-gray-900">{allConversations.length.toLocaleString()}</span> conversations ·
              Generated: {new Date().toLocaleDateString()}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
