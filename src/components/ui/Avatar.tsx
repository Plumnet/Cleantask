type AvatarProps = {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`
          rounded-full object-cover
          ${sizeStyles[size]}
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full
        bg-blue-100 text-blue-700 font-medium
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
