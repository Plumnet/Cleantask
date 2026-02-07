import type { StockOutRecord } from "@/types/consumable";
import { Card } from "@/components/ui/Card";

type StockOutHistoryProps = {
  records: StockOutRecord[];
};

export function StockOutHistory({ records }: StockOutHistoryProps) {
  if (records.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-4">切らし歴はありません</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="font-medium text-gray-900 mb-3">切らし歴</h3>
      <div className="space-y-2">
        {records.map((record) => (
          <div
            key={record.id}
            className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <p className="text-sm text-gray-900">{record.date}</p>
              {record.note && (
                <p className="text-sm text-gray-500 mt-0.5">{record.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
