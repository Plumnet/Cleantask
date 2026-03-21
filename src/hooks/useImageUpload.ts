"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type UseImageUploadOptions = {
  bucket: string;
  pathPrefix: string;
  existingFileName?: string;
};

export function useImageUpload({
  bucket,
  pathPrefix,
  existingFileName,
}: UseImageUploadOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imageFileName, setImageFileName] = useState(existingFileName ?? "");

  // 編集時：既存画像のプレビュー用 signed URL を取得
  useEffect(() => {
    if (!existingFileName) return;
    const supabase = createClient();
    supabase.storage
      .from(bucket)
      .createSignedUrl(existingFileName, 3600)
      .then(({ data }) => {
        if (data?.signedUrl) setImagePreviewUrl(data.signedUrl);
      });
  }, [existingFileName, bucket]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("JPEG / PNG / WebP 形式の画像を選択してください");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("5MB 以下の画像を選択してください");
      return;
    }

    setUploadError("");
    setIsUploading(true);
    setImagePreviewUrl(URL.createObjectURL(file));

    const ext = file.name.split(".").pop();
    const path = `${pathPrefix}/${Date.now()}.${ext}`;

    const supabase = createClient();
    const { error } = await supabase.storage.from(bucket).upload(path, file);

    if (error) {
      setUploadError("アップロードに失敗しました: " + error.message);
      setImagePreviewUrl("");
    } else {
      setImageFileName(path);
    }

    setIsUploading(false);
    e.target.value = "";
  };

  const clearImage = () => {
    setImageFileName("");
    setImagePreviewUrl("");
  };

  return {
    fileInputRef,
    isUploading,
    uploadError,
    imagePreviewUrl,
    imageFileName,
    handleFileChange,
    clearImage,
  };
}
