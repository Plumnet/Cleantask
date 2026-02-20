"use client";

import type { CleaningItem } from "@/types/cleaning";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCleaningContext } from "@/contexts/CleaningContext";

type WarningTaskCardProps = {
  item: CleaningItem;
};

export function WarningTaskCard({ item }: WarningTaskCardProps) {
  const { completeTask, cancelWarning } = useCleaningContext();
  const warningTask = item.warningTask;
  if (!warningTask) return null;

  const latestKaizen = item.kaizenHistory[item.kaizenHistory.length - 1];
  const stamps = warningTask.consecutiveOnTimeCount;

  return (
    <Card className="border-amber-300 bg-amber-50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-amber-900">{item.name}</h4>
          <span className="text-xs text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
            警戒タスク
          </span>
        </div>

        {latestKaizen && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">改善メモ:</span>{" "}
            {latestKaizen.cause}
          </p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">連続達成:</span>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                  i < stamps
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {i < stamps ? "✓" : (i + 1)}
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-500">{stamps}/3</span>
        </div>

        <p className="text-xs text-gray-500">
          次回期限: {item.nextCleaningAt} ／ 周期: {item.frequency}日
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => completeTask(item.id)}
          >
            完了
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => cancelWarning(item.id)}
          >
            キャンセル
          </Button>
        </div>
      </div>
    </Card>
  );
}
