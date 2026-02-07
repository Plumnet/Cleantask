type CounterProps = {
  current: number;
  max: number;
  className?: string;
};

export function Counter({ current, max, className = "" }: CounterProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex gap-0.5">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={`
              w-3 h-3 rounded-full border-2
              ${
                i < current
                  ? "bg-blue-600 border-blue-600"
                  : "bg-transparent border-gray-300"
              }
            `}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500 ml-1">
        ({current}/{max})
      </span>
    </div>
  );
}
