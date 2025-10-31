interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon?: React.ReactNode;
}

export default function MetricCard({ label, value, delta, icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {delta && (
            <p className="mt-1 text-sm text-gray-500">{delta}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-blue-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
