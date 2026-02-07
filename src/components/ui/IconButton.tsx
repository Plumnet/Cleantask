import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
  variant?: "default" | "danger";
};

export function IconButton({
  children,
  label,
  variant = "default",
  className = "",
  ...props
}: IconButtonProps) {
  const variantStyles = {
    default: "text-gray-600 hover:bg-gray-100",
    danger: "text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`
        p-2 rounded-md transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
