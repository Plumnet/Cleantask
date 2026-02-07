"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";

type HeaderDropdownProps = {
  userName: string;
  avatarUrl?: string;
};

export function HeaderDropdown({ userName, avatarUrl }: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Avatar name={userName} src={avatarUrl} size="sm" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
          </div>
          <Link
            href="/account"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            アカウント設定
          </Link>
          <Link
            href="/login"
            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            ログアウト
          </Link>
        </div>
      )}
    </div>
  );
}
