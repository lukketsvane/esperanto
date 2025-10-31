import { useState } from 'react';
import { Conversation } from '@/lib/types';
import { searchConversations } from '@/lib/dataLoader';
import ConfidenceBar from '../ConfidenceBar';

interface SearchTabProps {
  conversations: Conversation[];
}

export default function SearchTab({ conversations }: SearchTabProps) {
  const [searchType, setSearchType] = useState<'title' | 'message' | 'participant'>('title');
  const [searchTerm, setSearchTerm] = useState('');

  const results = searchConversations(conversations, searchTerm, searchType);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Search Conversations</h2>

      {/* Search Controls */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Search in:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSearchType('title')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                searchType === 'title'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Title
            </button>
            <button
              onClick={() => setSearchType('message')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                searchType === 'message'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              First Message
            </button>
            <button
              onClick={() => setSearchType('participant')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                searchType === 'participant'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Participant ID
            </button>
          </div>
        </div>

        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        {searchTerm && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm font-medium text-green-800">
              Found {results.length} matching conversations
            </p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm && results.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Folder
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Participant ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Confidence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Messages
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((conv, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{conv.source_folder}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                      <div className="truncate" title={conv.title}>
                        {conv.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-xs text-gray-700">
                      {conv.participant_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{conv.match_method}</td>
                    <td className="px-4 py-3">
                      <div className="w-32">
                        <ConfidenceBar confidence={conv.match_confidence} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      {conv.user_msg_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {searchTerm && results.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-medium">No conversations found matching &quot;{searchTerm}&quot;</p>
          <p className="text-yellow-600 text-sm mt-2">Try a different search term or search type</p>
        </div>
      )}

      {!searchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-medium">Enter a search term to find conversations</p>
          <p className="text-blue-600 text-sm mt-2">Search works across filtered results</p>
        </div>
      )}
    </div>
  );
}
