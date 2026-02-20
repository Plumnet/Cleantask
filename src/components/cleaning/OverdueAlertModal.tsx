"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { CleaningItem } from "@/types/cleaning";

type OverdueAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  overdueItems: CleaningItem[];
  onStartKaizen: (itemId: string) => void;
};

export function OverdueAlertModal({
  isOpen,
  onClose,
  overdueItems,
  onStartKaizen,
}: OverdueAlertModalProps) {
  if (overdueItems.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="周期超過のお知らせ"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          周期を過ぎてしまった掃除が発生しました。
        </p>
        <ul className="space-y-2">
          {overdueItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-red-800">
                {item.name}
              </span>
              <Button
                size="sm"
                onClick={() => {
                  onStartKaizen(item.id);
                }}
              >
                改善する
              </Button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </div>
    </Modal>
  );
}
