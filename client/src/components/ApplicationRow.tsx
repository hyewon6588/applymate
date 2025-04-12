"use client";

import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import { FaCheckCircle } from "react-icons/fa";
import StatusSelector from "./StatusSelector";

type StatusType = "saved" | "applied" | "interview" | "offered" | "rejected";

export default function ApplicationRow() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<StatusType>("saved");

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({
    resume: "",
    coverletter: "",
    transcript: "",
    job_posting: "",
  });

  const handleFileUpload = (fileType: string, file: File | null) => {
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [fileType]: file.name }));
      console.log(`[${fileType}] uploaded: ${file.name}`);
    }
  };

  const renderFileCell = (
    label: string,
    fileType: string,
    className = "w-[240px]"
  ) => (
    <TableCell className={className}>
      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200">
        {label}
        <input
          type="file"
          className="hidden"
          onChange={(e) =>
            handleFileUpload(fileType, e.target.files?.[0] || null)
          }
        />
      </label>

      {uploadedFiles[fileType] && (
        <span className="mt-1 text-xs text-gray-600 flex items-center gap-1 truncate max-w-[220px]">
          <FaCheckCircle className="text-green-500" />
          {uploadedFiles[fileType]}
        </span>
      )}
    </TableCell>
  );

  return (
    <TableRow className="text-sm [&>td]:py-3">
      {/* Company */}
      <TableCell className="min-w-[220px]">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm"
        />
      </TableCell>

      {/* Position */}
      <TableCell className="min-w-[220px]">
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm"
        />
      </TableCell>

      {/* Location */}
      <TableCell className="min-w-[220px]">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm"
        />
      </TableCell>

      {/* Status Badge + Change */}
      <TableCell className="min-w-[160px]">
        <StatusSelector value={status} onChange={setStatus} />
      </TableCell>

      {/* File Upload Cells */}
      {renderFileCell(
        "Add Job Posting",
        "job_posting",
        "min-w-[240px] max-w-[280px]"
      )}
      {renderFileCell("Upload Resume", "resume", "min-w-[240px] max-w-[280px]")}
      {renderFileCell(
        "Attach Cover Letter",
        "coverletter",
        "min-w-[240px] max-w-[280px]"
      )}
      {renderFileCell(
        "Upload Transcript",
        "transcript",
        "min-w-[240px] max-w-[280px]"
      )}

      {/* Match %, Keyword Check */}
      <TableCell className="min-w-[160px]">—</TableCell>
      <TableCell className="min-w-[160px]">—</TableCell>
    </TableRow>
  );
}
