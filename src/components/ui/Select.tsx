import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
};

export function Select({
  label,
  options,
  error,
  placeholder,
  className = "",
  id,
  required,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full rounded-md border border-gray-300 px-3 py-2
          text-gray-900 bg-white
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        required={required}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
