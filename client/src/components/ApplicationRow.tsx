"use client";

import { useState, useEffect } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FaCheckCircle, FaEdit } from "react-icons/fa";
import StatusSelector from "./StatusSelector";

type StatusType = "saved" | "applied" | "interview" | "offered" | "rejected";

const debounce = (func: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

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

  const saveApplicationToDB = debounce((data: any) => {
    console.log("Saving to DB: ", data);
  }, 800);

  useEffect(() => {
    saveApplicationToDB({
      company,
      position,
      location,
      status,
      uploadedFiles,
    });
  }, [company, position, location, status, uploadedFiles]);

  const handleFileUpload = (fileType: string, file: File | null) => {
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [fileType]: file.name }));
    }
  };

  const renderFileCell = (
    label: string,
    fileType: string,
    className = "w-[240px]"
  ) => (
    <TableCell className={className}>
      {uploadedFiles[fileType] ? (
        <div className="flex items-center gap-4">
          <span className="mt-1 text-md text-gray-600 flex items-center gap-2 truncate max-w-[220px]">
            <FaCheckCircle className="text-green-500" />
            {uploadedFiles[fileType]}
          </span>
          <label className="cursor-pointer text-blue-500 hover:text-blue-700">
            <FaEdit className="text-lg translate-y-[2px]" />
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                handleFileUpload(fileType, e.target.files?.[0] || null)
              }
            />
          </label>
        </div>
      ) : (
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
