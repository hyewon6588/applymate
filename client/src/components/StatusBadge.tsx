// src/components/StatusBadge.tsx

import { cn } from "@/lib/utils";

export default function StatusBadge({
  status,
}: {
  status: keyof typeof statusMap;
}) {
  const { label, color } = statusMap[status] || statusMap.saved;

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        color === "gray" && "bg-gray-200 text-gray-700",
        color === "blue" && "bg-blue-100 text-blue-700",
        color === "indigo" && "bg-indigo-100 text-indigo-700",
        color === "green" && "bg-green-100 text-green-700",
        color === "red" && "bg-red-100 text-red-700"
      )}
    >
      {label}
    </span>
  );
}

const statusMap = {
  saved: { label: "Saved", color: "gray" },
  applied: { label: "Applied", color: "blue" },
  interview: { label: "Interview", color: "indigo" },
  offered: { label: "Offered", color: "green" },
  rejected: { label: "Rejected", color: "red" },
} as const;
