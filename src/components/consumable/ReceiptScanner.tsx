"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ConsumableItem } from "@/types/consumable";
import {
  restockConsumable,
  analyzeReceiptImage,
} from "@/app/(main)/consumable/actions";

type Props = {
  item: ConsumableItem;
};

type Step = "idle" | "camera" | "captured" | "processing" | "recognized" | "done";

export function ReceiptScanner({ item }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [step, setStep] = useState<Step>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizedName, setRecognizedName] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string>("");

  // カメラ一覧を取得（内蔵カメラ優先）
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        const sorted = [...videoDevices].sort((a) =>
          /FaceTime|Built-in|内蔵/i.test(a.label) ? -1 : 1,
        );
        setCameras(sorted);
        if (sorted.length > 0) setSelectedCameraId(sorted[0].deviceId);
      })
      .catch(() => {
        // enumerateDevices は権限なしでも空ラベルで返ることがある
      });
  }, []);

  // アンマウント時にカメラを停止
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startCameraWithId = async (deviceId: string) => {
    setCameraError("");
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStep("camera");
      setCapturedImage(null);
      setRecognizedName(null);

      // 許可取得後に再列挙するとラベルと deviceId が正しく取得できる
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      const sorted = [...videoDevices].sort((a) =>
        /FaceTime|Built-in|内蔵/i.test(a.label) ? -1 : 1,
      );
      setCameras(sorted);
    } catch {
      setCameraError("カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。");
    }
  };

  const startCamera = async () => startCameraWithId(selectedCameraId);

  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");

    // カメラ停止
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    setCapturedImage(dataUrl);
    setStep("processing");

    // OCR 解析（OCR_MODE=mock なら 2秒待機後に商品名を返す、real なら Cloud Vision API を使用）
    const { recognizedName } = await analyzeReceiptImage(dataUrl, item.name);
    setRecognizedName(recognizedName);
    setStep("recognized");
  };

  const handleRetake = async () => {
    setCapturedImage(null);
    await startCamera();
  };

  const handleConfirm = async () => {
    await restockConsumable(item.id);
    setStep("done");
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">レシート読み取り</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        {/* 対象消耗品 */}
        <div className="text-sm text-gray-600">
          補充対象：<span className="font-medium text-gray-900">{item.name}</span>
        </div>

        {/* カメラ選択（複数台ある場合のみ表示） */}
        {cameras.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              カメラを選択
            </label>
            <select
              value={selectedCameraId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedCameraId(newId);
                if (step === "camera") startCameraWithId(newId);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {cameras.map((cam, i) => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || `カメラ ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* エラー表示 */}
        {cameraError && (
          <p className="text-sm text-red-500">{cameraError}</p>
        )}

        {/* カメラ未起動: 起動ボタン */}
        {step === "idle" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 text-center">
              カメラを起動してレシートを撮影してください
            </p>
            <button
              type="button"
              onClick={startCamera}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              カメラを起動
            </button>
          </div>
        )}

        {/* カメラ映像 */}
        {step === "camera" && (
          <div className="space-y-3">
            <div className="relative bg-black rounded-md overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={captureImage}
              className="w-full py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              シャッター
            </button>
          </div>
        )}

        {/* 撮影済みプレビュー（解析中・認識完了でも表示） */}
        {capturedImage && step !== "done" && (
          <div className="space-y-3">
            <div className="rounded-md overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedImage} alt="撮影したレシート" className="w-full object-cover" />
            </div>
            {step === "captured" && (
              <button
                type="button"
                onClick={handleRetake}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
              >
                撮り直し
              </button>
            )}
          </div>
        )}

        {/* 解析中 */}
        {step === "processing" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">レシートを解析中...</p>
          </div>
        )}

        {/* 認識完了 */}
        {step === "recognized" && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-800 font-medium mb-1">認識された商品</p>
              <p className="text-base font-semibold text-green-900">{recognizedName}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
              >
                撮り直し
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                補充する
              </button>
            </div>
          </div>
        )}

        {/* 補充完了 */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-900">補充が完了しました！</p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">{item.name}</span> の在庫が最大数に戻りました
            </p>
            <button
              type="button"
              onClick={() => router.push("/consumable/list")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              一覧に戻る
            </button>
          </div>
        )}
      </div>

      {/* hidden canvas（撮影用） */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-6">
        <Link href="/consumable/list" className="text-blue-600 hover:underline text-sm">
          ← 一覧に戻る
        </Link>
      </div>
    </div>
  );
}
