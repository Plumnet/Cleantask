import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({
  label,
  error,
  className = "",
  id,
  required,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-md border border-gray-300 px-3 py-2
          text-gray-900 placeholder:text-gray-400
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        required={required}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
