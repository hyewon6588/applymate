"use client";

import { useState, useEffect } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FaCheckCircle } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import StatusSelector from "./StatusSelector";

type StatusType = "saved" | "applied" | "interview" | "offered" | "rejected";

type UploadedFileEntry = {
  name: string;
  url: string;
};

const debounce = (func: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function ApplicationRow() {
  const [applicationId] = useState(() => Date.now().toString());
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<StatusType>("saved");

  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, UploadedFileEntry>
  >({
    // resume: "",
    // coverletter: "",
    // transcript: "",
    // job_posting: "",
  });

  const saveApplicationToDB = debounce(async (data: any) => {
    try {
      const res = await fetch("http://localhost:8000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log("✅ Synced to backend:", result);
    } catch (err) {
      console.error("❌ Save failed:", err);
    }
  }, 800);

  useEffect(() => {
    saveApplicationToDB({
      application_id: applicationId,
      company,
      position,
      location,
      status,
      uploadedFiles,
    });
  }, [company, position, location, status, uploadedFiles]);

  const handleFileUpload = async (fileType: string, file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType);
    formData.append("user_id", "demo_user"); // Replace when auth is added
    formData.append("company", company);
    formData.append("position", position);

    try {
      const res = await fetch("http://localhost:8000/upload/resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();

      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: {
          name: file.name,
          url,
        },
      }));
    } catch (err) {
      console.error(`❌ ${fileType} upload failed`, err);
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
            {uploadedFiles[fileType]?.name}
          </span>
          <label className="cursor-pointer text-blue-500 hover:text-blue-700">
            <FiEdit2 className="text-lg translate-y-[2px]" />
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
