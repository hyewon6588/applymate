"use client";

import { useState, useRef, useEffect } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FaCheckCircle } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import StatusSelector from "./StatusSelector";
import { jwtDecode } from "jwt-decode";

type StatusType = "saved" | "applied" | "interview" | "offered" | "rejected";

type UploadedFileEntry = {
  name: string;
  url: string;
};

type ApplicationRowProps = {
  initialData: {
    application_id: string;
    user_id?: string;
    company: string;
    position: string;
    location: string;
    status: StatusType;
    uploadedFiles: Record<string, UploadedFileEntry | null>;
    match_score?: number;
  };
};

type JwtPayload = {
  sub: string;
  exp: number;
};

function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub;
  } catch (err) {
    console.error("❌ Failed to decode token:", err);
    return null;
  }
}

const debounce = (func: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function ApplicationRow({ initialData }: ApplicationRowProps) {
  const [applicationId] = useState(initialData.application_id);
  const [userId] = useState(() => getUserIdFromToken() || "guest_user");

  const [company, setCompany] = useState(initialData.company || "");
  const [position, setPosition] = useState(initialData.position || "");
  const [location, setLocation] = useState(initialData.location || "");
  const [status, setStatus] = useState<StatusType>(
    initialData.status || "saved"
  );

  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, UploadedFileEntry | null>
  >({
    resume: initialData.uploadedFiles?.resume ?? null,
    coverletter: initialData.uploadedFiles?.coverletter ?? null,
    transcript: initialData.uploadedFiles?.transcript ?? null,
    job_posting: initialData.uploadedFiles?.job_posting ?? null,
  });

  const [matchScore, setMatchScore] = useState<number | null>(
    initialData.match_score ?? null
  );
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);

  const didMount = useRef(false);
  const isNewRow = useRef(
    initialData.company === "" &&
      initialData.position === "" &&
      initialData.location === "" &&
      Object.values(initialData.uploadedFiles || {}).every((f) => !f?.url)
  );
  const hasChanged = useRef(false);

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
    didMount.current = true;
  }, []);

  useEffect(() => {
    if (!didMount.current || isNewRow.current || !hasChanged.current) return;

    hasChanged.current = false;

    const hasFile = Object.values(uploadedFiles).some(
      (f) => f?.url && f.url.length > 0
    );

    if (!company && !position && !location && !hasFile) return;

    saveApplicationToDB({
      application_id: applicationId,
      user_id: userId,
      company,
      position,
      location,
      status,
      uploadedFiles,
    });
  }, [company, position, location, status, uploadedFiles]);

  const handleFileUpload = async (fileType: string, file: File | null) => {
    if (!file) return;

    isNewRow.current = false;
    hasChanged.current = true;
    setMatchScore(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType);
    formData.append("user_id", userId);
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

  const handleCheckMatch = async () => {
    setIsCheckingMatch(true);
    try {
      const res = await fetch(
        `http://localhost:8000/applications/${applicationId}/analyze-match`,
        { method: "POST" }
      );
      const result = await res.json();
      setMatchScore(result.match_score);
    } catch (err) {
      console.error("❌ Match score fetch failed", err);
    } finally {
      setIsCheckingMatch(false);
    }
  };

  const renderFileCell = (
    label: string,
    fileType: string,
    className = "w-[240px]"
  ) => (
    <TableCell className={className}>
      {uploadedFiles[fileType]?.url ? (
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

  const resumeReady = !!uploadedFiles.resume?.url;
  const jdReady = !!uploadedFiles.job_posting?.url;

  return (
    <TableRow className="text-sm [&>td]:py-3">
      <TableCell className="min-w-[220px]">
        <input
          type="text"
          value={company}
          onChange={(e) => {
            isNewRow.current = false;
            hasChanged.current = true;
            setCompany(e.target.value);
          }}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm"
        />
      </TableCell>
      <TableCell className="min-w-[220px]">
        <input
          type="text"
          value={position}
          onChange={(e) => {
            isNewRow.current = false;
            hasChanged.current = true;
            setPosition(e.target.value);
          }}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm"
        />
      </TableCell>
      <TableCell className="min-w-[220px]">
        <input
          type="text"
          value={location}
          onChange={(e) => {
            isNewRow.current = false;
            hasChanged.current = true;
            setLocation(e.target.value);
          }}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm"
        />
      </TableCell>
      <TableCell className="min-w-[160px]">
        <StatusSelector
          value={status}
          onChange={(val) => {
            isNewRow.current = false;
            hasChanged.current = true;
            setStatus(val);
          }}
        />
      </TableCell>
      {renderFileCell("Add Job Posting", "job_posting")}
      {renderFileCell("Upload Resume", "resume")}
      {renderFileCell("Attach Cover Letter", "coverletter")}
      {renderFileCell("Upload Transcript", "transcript")}
      {/* Match % */}
      <TableCell className="min-w-[160px]">
        {matchScore !== null ? (
          <span className="text-green-700 font-semibold">{matchScore}%</span>
        ) : resumeReady && jdReady ? (
          <button
            onClick={handleCheckMatch}
            disabled={isCheckingMatch}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            {isCheckingMatch ? "Checking..." : "Check Match"}
          </button>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </TableCell>
      <TableCell className="min-w-[160px]">—</TableCell>
    </TableRow>
  );
}
