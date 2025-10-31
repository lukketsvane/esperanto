import { Filters } from '@/lib/types';

interface FilterSidebarProps {
  filters: Filters;
  folders: string[];
  matchMethods: string[];
  participants: string[];
  totalCount: number;
  filteredCount: number;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterSidebar({
  filters,
  folders,
  matchMethods,
  participants,
  totalCount,
  filteredCount,
  onFilterChange,
}: FilterSidebarProps) {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      folder: 'All',
      matchMethod: 'All',
      matchConfidence: 'All',
      participantId: 'All',
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveFilters =
    filters.folder !== 'All' ||
    filters.matchMethod !== 'All' ||
    filters.matchConfidence !== 'All' ||
    filters.participantId !== 'All' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto h-screen sticky top-0">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Filters</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-blue-700">{filteredCount.toLocaleString()}</span> of{' '}
            <span className="font-bold text-gray-900">{totalCount.toLocaleString()}</span> conversations
          </p>
          {filteredCount < totalCount && (
            <p className="text-xs text-gray-500 mt-1">
              ({Math.round((filteredCount / totalCount) * 100)}% of total)
            </p>
          )}
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full mb-4 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
        >
          ✕ Clear All Filters
        </button>
      )}

      <div className="space-y-6">
        {/* CSN Folder Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📁 CSN Folder
          </label>
          <select
            value={filters.folder}
            onChange={(e) => updateFilter('folder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>

        {/* Match Method Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Match Method
          </label>
          <select
            value={filters.matchMethod}
            onChange={(e) => updateFilter('matchMethod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {matchMethods.map((method) => (
              <option key={method} value={method}>
                {method === 'All' ? 'All' : method.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Match Confidence Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ⭐ Match Confidence
          </label>
          <select
            value={filters.matchConfidence}
            onChange={(e) => updateFilter('matchConfidence', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="All">All</option>
            <option value="high">High (✓ &lt;15 min)</option>
            <option value="medium">Medium (~ 15-45 min)</option>
            <option value="low">Low (⚠ 45-120 min)</option>
          </select>
        </div>

        {/* Participant Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            👤 Participant ID
          </label>
          <select
            value={filters.participantId}
            onChange={(e) => updateFilter('participantId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm max-h-40"
            size={1}
          >
            {participants.slice(0, 100).map((pid) => (
              <option key={pid} value={pid}>
                {pid === 'All' ? 'All Participants' : pid}
              </option>
            ))}
          </select>
          {participants.length > 100 && (
            <p className="text-xs text-gray-500 mt-1">Showing first 100 participants</p>
          )}
        </div>

        {/* Date Range Filters */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📅 Date Range
          </label>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Filters</h3>
        <div className="space-y-2 text-xs">
          {filters.folder !== 'All' && (
            <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
              <span>Folder: {filters.folder}</span>
              <button
                onClick={() => updateFilter('folder', 'All')}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}
          {filters.matchMethod !== 'All' && (
            <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
              <span>Method: {filters.matchMethod.replace(/_/g, ' ')}</span>
              <button
                onClick={() => updateFilter('matchMethod', 'All')}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}
          {filters.matchConfidence !== 'All' && (
            <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
              <span>Confidence: {filters.matchConfidence}</span>
              <button
                onClick={() => updateFilter('matchConfidence', 'All')}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}
          {filters.participantId !== 'All' && (
            <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
              <span className="truncate">Participant: {filters.participantId}</span>
              <button
                onClick={() => updateFilter('participantId', 'All')}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                ✕
              </button>
            </div>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
              <span>
                Date: {filters.dateFrom || '...'} to {filters.dateTo || '...'}
              </span>
              <button
                onClick={() => {
                  updateFilter('dateFrom', '');
                  updateFilter('dateTo', '');
                }}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}
          {!hasActiveFilters && (
            <p className="text-gray-500 italic">No active filters</p>
          )}
        </div>
      </div>
    </aside>
  );
}
