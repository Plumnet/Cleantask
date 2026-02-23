import type { Metadata } from "next";
import "./globals.css";
import { DevInspector } from "@/components/DevInspector";

export const metadata: Metadata = {
  title: "CleanTask - 家事管理アプリ",
  description: "掃除・消耗品管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist&family=Geist+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <DevInspector />
        {children}
      </body>
    </html>
  );
}