// src/components/StatusSelector.tsx

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "./StatusBadge";

type StatusType = "saved" | "applied" | "interview" | "offered" | "rejected";

const statusOptions: StatusType[] = [
  "saved",
  "applied",
  "interview",
  "offered",
  "rejected",
];

export default function StatusSelector({
  value,
  onChange,
}: {
  value: StatusType;
  onChange: (newStatus: StatusType) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none">
          <StatusBadge status={value} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-44">
        {statusOptions.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onChange(option)}>
            <StatusBadge status={option} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
