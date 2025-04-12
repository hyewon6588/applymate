// src/components/ApplicationCard.tsx

"use client";

import { useState } from "react";
import StatusSelector from "./StatusSelector";
import { FaCheckCircle } from "react-icons/fa";

type StatusType = "saved" | "applied" | "interview" | "offered" | "rejected";

export default function ApplicationCard() {
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

  const handleUpload = (fileType: string, file: File | null) => {
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [fileType]: file.name }));
    }
  };

  const renderUpload = (label: string, type: string) => (
    <div className="flex flex-col gap-1">
      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200">
        {label}
        <input
          type="file"
          className="hidden"
          onChange={(e) => handleUpload(type, e.target.files?.[0] || null)}
        />
      </label>
      {uploadedFiles[type] && (
        <span className="text-xs text-gray-600 flex items-center gap-1">
          <FaCheckCircle className="text-green-500" />
          {uploadedFiles[type]}
        </span>
      )}
    </div>
  );

  return (
    <div className="block md:hidden border rounded-xl p-4 mb-4 shadow-sm bg-white text-sm space-y-3">
      <div>
        <strong>Company:</strong>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-sm"
        />
      </div>

      <div>
        <strong>Position:</strong>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-sm"
        />
      </div>

      <div>
        <strong>Location:</strong>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <strong>Status:</strong>
        <div className="mt-1">
          <StatusSelector value={status} onChange={setStatus} />
        </div>
      </div>

      {renderUpload("Add Job Posting", "job_posting")}
      {renderUpload("Upload Resume", "resume")}
      {renderUpload("Attach Cover Letter", "coverletter")}
      {renderUpload("Upload Transcript", "transcript")}

      <div className="pt-2 border-t text-xs text-gray-500">
        Match %: — | Keyword: —
      </div>
    </div>
  );
}
