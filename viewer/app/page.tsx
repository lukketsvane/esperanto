'use client';

import { useEffect, useState } from 'react';
import { Conversation, Filters } from '@/lib/types';
import { loadConversations, filterConversations, getUniqueValues } from '@/lib/dataLoader';
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
    minConfidence: 0.0,
  });

  const [folders, setFolders] = useState<string[]>([]);
  const [matchMethods, setMatchMethods] = useState<string[]>([]);

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
        setFolders(getUniqueValues(data, 'folder'));
        setMatchMethods(getUniqueValues(data, 'match_method'));
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

    const filtered = filterConversations(
      allConversations,
      filters.folder,
      filters.matchMethod,
      filters.minConfidence
    );
    setFilteredConvs(filtered);
  }, [filters, allConversations]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
          <h2 className="text-red-800 text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-red-700">{error}</p>
          <div className="mt-4 bg-white rounded p-4 text-sm text-gray-700">
            <p className="font-medium mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a <code className="bg-gray-100 px-1 rounded">public/data</code> directory in the viewer folder</li>
              <li>Copy <code className="bg-gray-100 px-1 rounded">output/matched_conversations.json</code> to <code className="bg-gray-100 px-1 rounded">public/data/</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold">📊 Esperanto Study Data Viewer</h1>
          <p className="text-blue-100 mt-1">
            Interactive viewer for ChatGPT conversation dataset
          </p>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          folders={folders}
          matchMethods={matchMethods}
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
          <footer className="bg-white border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-600">
            <p>
              <strong>Esperanto Study Data Viewer</strong> | Showing {filteredConvs.length.toLocaleString()} conversations |{' '}
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
