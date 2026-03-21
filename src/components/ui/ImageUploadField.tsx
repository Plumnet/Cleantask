"use client";

import type { RefObject } from "react";
import { Button } from "@/components/ui/Button";

type ImageUploadFieldProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  uploadError: string;
  imagePreviewUrl: string;
  imageFileName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
};

export function ImageUploadField({
  fileInputRef,
  isUploading,
  uploadError,
  imagePreviewUrl,
  imageFileName,
  onFileChange,
  onClear,
}: ImageUploadFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        画像
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileChange}
      />
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {isUploading ? "アップロード中..." : "画像を挿入"}
        </Button>
        {imageFileName && !isUploading && (
          <button
            type="button"
            className="text-xs text-red-500 hover:underline"
            onClick={onClear}
          >
            削除
          </button>
        )}
      </div>
      {uploadError && (
        <p className="text-sm text-red-500 mt-1">{uploadError}</p>
      )}
      {imagePreviewUrl && (
        <div className="mt-2">
          <img
            src={imagePreviewUrl}
            alt="プレビュー"
            className="w-32 h-32 object-cover rounded-md border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}
