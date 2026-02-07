import type { InputHTMLAttributes } from "react";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function SearchInput({ className = "", ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        className={`
          w-full rounded-md border border-gray-300 pl-10 pr-3 py-2
          text-gray-900 placeholder:text-gray-400
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
