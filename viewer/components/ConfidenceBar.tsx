interface ConfidenceBarProps {
  confidence: number;
  showLabel?: boolean;
}

export default function ConfidenceBar({ confidence, showLabel = true }: ConfidenceBarProps) {
  const getColor = (conf: number) => {
    if (conf >= 0.95) return 'bg-green-500';
    if (conf >= 0.80) return 'bg-blue-500';
    if (conf >= 0.60) return 'bg-yellow-500';
    if (conf >= 0.40) return 'bg-orange-500';
    if (conf > 0) return 'bg-red-400';
    return 'bg-gray-400';
  };

  const percentage = Math.round(confidence * 100);
  const color = getColor(confidence);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 w-12 text-right">
          {confidence.toFixed(2)}
        </span>
      )}
    </div>
  );
}
