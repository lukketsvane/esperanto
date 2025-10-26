import { Filters } from '@/lib/types';

interface FilterSidebarProps {
  filters: Filters;
  folders: string[];
  matchMethods: string[];
  totalCount: number;
  filteredCount: number;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterSidebar({
  filters,
  folders,
  matchMethods,
  totalCount,
  filteredCount,
  onFilterChange,
}: FilterSidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg p-6 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">🔍 Filters</h2>

      {/* Folder Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Study Folder
        </label>
        <select
          value={filters.folder}
          onChange={(e) => onFilterChange({ ...filters, folder: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          {folders.map(folder => (
            <option key={folder} value={folder}>{folder}</option>
          ))}
        </select>
      </div>

      {/* Match Method Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Match Method
        </label>
        <select
          value={filters.matchMethod}
          onChange={(e) => onFilterChange({ ...filters, matchMethod: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          {matchMethods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      {/* Confidence Threshold */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Confidence
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={filters.minConfidence}
          onChange={(e) => onFilterChange({ ...filters, minConfidence: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.0</span>
          <span className="font-medium text-gray-900">{filters.minConfidence.toFixed(1)}</span>
          <span>1.0</span>
        </div>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-900">
          Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} conversations
        </p>
      </div>
    </div>
  );
}
