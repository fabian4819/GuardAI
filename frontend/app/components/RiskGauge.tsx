export function RiskGauge({ score }: { score: number }) {
  const color = score < 40 ? "bg-green-500" : score < 70 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>Risk Score</span>
        <span className="font-bold text-white">{score} / 100</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Safe</span>
        <span>Threshold: 70</span>
        <span>Danger</span>
      </div>
    </div>
  );
}
