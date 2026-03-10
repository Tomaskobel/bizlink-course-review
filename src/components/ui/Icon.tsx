import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  className?: string;
  size?: 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | 40 | 48;
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
}

export function Icon({
  name,
  className,
  size = 20,
  fill = false,
  weight = 300,
}: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `"FILL" ${fill ? 1 : 0}, "wght" ${weight}, "GRAD" 0, "opsz" ${size}`,
      }}
    >
      {name}
    </span>
  );
}
