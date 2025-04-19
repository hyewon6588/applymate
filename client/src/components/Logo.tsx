// components/Logo.tsx
interface LogoProps {
  size?: "large" | "small";
}

export default function Logo({ size = "large" }: LogoProps) {
  const isLarge = size === "large";
  return (
    <div className={isLarge ? "mb-8 mt-30" : "mb-0"}>
      <h1
        className={`${
          isLarge ? "text-4xl" : "text-2xl"
        } + " font-bold text-[#0f172a] mb-1`}
      >
        ApplyMate
      </h1>
      <p className="text-sm font-bold text-muted-foreground">
        Rate: Organized, Yours.
      </p>
    </div>
  );
}
