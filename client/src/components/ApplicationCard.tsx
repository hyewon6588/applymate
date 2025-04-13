// // src/components/ApplicationCard.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import StatusSelector from "./StatusSelector";
import { FaCheckCircle } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";

type StatusType = "saved" | "applied" | "interview" | "offered" | "rejected";

type UploadedFileEntry = {
  name: string;
  url: string;
};

type ApplicationProps = {
  initialData: {
    application_id: string;
    user_id?: string;
    company: string;
    position: string;
    location: string;
    status: StatusType;
    uploadedFiles: Record<string, UploadedFileEntry | null>;
  };
};

const debounce = (func: Function, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function ApplicationCard({ initialData }: ApplicationProps) {
  const [applicationId] = useState(
    () => initialData?.application_id || Date.now().toString()
  );
  const [userId] = useState("demo_user");
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

  const handleUpload = async (fileType: string, file: File | null) => {
    if (!file) return;

    isNewRow.current = false;
    hasChanged.current = true;

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

  const renderUpload = (label: string, type: string) => (
    <div className="flex flex-col gap-1">
      {uploadedFiles[type] ? (
        <div className="flex items-center gap-4">
          <span className="mt-1 text-md text-gray-600 flex items-center gap-2 truncate max-w-[220px]">
            <FaCheckCircle className="text-green-500" />
            {uploadedFiles[type]?.name}
          </span>
          <label className="cursor-pointer text-blue-500 hover:text-blue-700">
            <FiEdit2 className="text-lg translate-y-[2px]" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleUpload(type, e.target.files?.[0] || null)}
            />
          </label>
        </div>
      ) : (
        <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200">
          {label}
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleUpload(type, e.target.files?.[0] || null)}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="block md:hidden border rounded-xl p-4 mb-4 shadow-sm bg-white text-sm space-y-3">
      <div>
        <strong>Company:</strong>
        <input
          value={company}
          onChange={(e) => {
            isNewRow.current = false;
            hasChanged.current = true;
            setCompany(e.target.value);
          }}
          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-sm"
        />
      </div>

      <div>
        <strong>Position:</strong>
        <input
          value={position}
          onChange={(e) => {
            isNewRow.current = false;
            hasChanged.current = true;
            setPosition(e.target.value);
          }}
          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-sm"
        />
      </div>

      <div>
        <strong>Location:</strong>
        <input
          value={location}
          onChange={(e) => {
            isNewRow.current = false;
            hasChanged.current = true;
            setLocation(e.target.value);
          }}
          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <strong>Status:</strong>
        <div className="mt-1">
          <StatusSelector
            value={status}
            onChange={(val) => {
              isNewRow.current = false;
              hasChanged.current = true;
              setStatus(val);
            }}
          />
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
