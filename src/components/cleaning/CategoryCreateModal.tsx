"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCleaningContext } from "@/contexts/CleaningContext";
import { CATEGORY_NAME_MAX_LENGTH } from "@/lib/constants";

type CategoryCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CategoryCreateModal({
  isOpen,
  onClose,
}: CategoryCreateModalProps) {
  const { addCategory } = useCleaningContext();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError("カテゴリー名を入力してください");
      return;
    }
    if (trimmed.length > CATEGORY_NAME_MAX_LENGTH) {
      setError(`カテゴリー名は${CATEGORY_NAME_MAX_LENGTH}文字以内で入力してください`);
      return;
    }

    const result = addCategory(trimmed);
    if (!result) {
      setError("同じ名前のカテゴリーが既に存在します");
      return;
    }

    setName("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="カテゴリー作成">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="カテゴリー名"
          type="text"
          placeholder="例: リビング"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          maxLength={CATEGORY_NAME_MAX_LENGTH}
          error={error}
          required
        />
        <p className="text-xs text-gray-500">{name.length}/{CATEGORY_NAME_MAX_LENGTH}文字</p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button type="submit">登録する</Button>
        </div>
      </form>
    </Modal>
  );
}
