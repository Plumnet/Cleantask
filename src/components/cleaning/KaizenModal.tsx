"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCleaningContext } from "@/contexts/CleaningContext";

type KaizenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
};

export function KaizenModal({ isOpen, onClose, itemId }: KaizenModalProps) {
  const { items, submitKaizen } = useCleaningContext();
  const item = items.find((i) => i.id === itemId);

  const [cause, setCause] = useState("");
  const [frequency, setFrequency] = useState(item?.frequency ?? 7);
  const [error, setError] = useState("");

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cause.trim()) {
      setError("原因を入力してください");
      return;
    }

    submitKaizen(itemId, cause.trim(), frequency);
    setCause("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="改善登録">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-red-600">{item.name}</span>
          の周期を過ぎてしまいました。原因を振り返り、改善しましょう。
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            原因 <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            rows={3}
            placeholder="例: 忙しくて後回しにしてしまった"
            value={cause}
            onChange={(e) => {
              setCause(e.target.value);
              setError("");
            }}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        <Input
          label="周期（日数）"
          type="number"
          min={1}
          max={365}
          value={frequency}
          onChange={(e) => setFrequency(Number(e.target.value))}
        />
        <p className="text-xs text-gray-500">
          現在の周期: {item.frequency}日（変更しなくても登録できます）
        </p>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="submit">登録する</Button>
        </div>
      </form>
    </Modal>
  );
}
