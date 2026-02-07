"use client";

import Link from "next/link";
import { HeaderDropdown } from "./HeaderDropdown";
import { mockUser } from "@/data/mockUser";

function getCurrentDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

export function Header() {
  const alertCount = 3;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/top" className="text-xl font-bold text-blue-600">
          CleanTask
        </Link>

        <div className="text-sm text-gray-600 hidden sm:block">
          {getCurrentDateTime()}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            aria-label="アラート"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                {alertCount}
              </span>
            )}
          </button>

          <HeaderDropdown
            userName={mockUser.username}
            avatarUrl={mockUser.avatarUrl}
          />
        </div>
      </div>
    </header>
  );
}
