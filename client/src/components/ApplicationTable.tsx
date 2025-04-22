"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ApplicationRow from "./ApplicationRow";
import ApplicationCard from "./ApplicationCard";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useIsMobile from "@/hooks/useIsMobile";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ApplicationTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackKeywords, setFeedbackKeywords] = useState<string[]>([]);
  // const addRow = () => setRows((prev) => [...prev, Date.now()]);
  const isMobile = useIsMobile();

  const isEmpty = rows.length === 0;

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        application_id: uuidv4(),
        company: "",
        position: "",
        location: "",
        status: "saved",
        uploadedFiles: {},
      },
    ]);
  };
  // Fetch existing applications from backend
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/applications/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setRows(data);
    } catch (err) {
      console.error("❌ Failed to fetch applications", err);
    }
  };

  const handleShowKeywordFeedback = async (applicationId: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/applications/${applicationId}/keyword-feedback`,
        { method: "POST" }
      );
      const result = await res.json();
      setFeedbackKeywords(result.keyword_feedback || []);
      setShowFeedbackModal(true);
    } catch (err) {
      console.error("❌ Failed to fetch keyword feedback", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 flex flex-col justify-center">
      {/* Top Button */}
      {!isEmpty && !isMobile && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={addRow}
            variant="outline"
            className="shadow-sm hover:bg-blue-50"
          >
            + New Application
          </Button>
        </div>
      )}

      {/* Empty State */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4 text-muted-foreground">
          <p className="text-lg">No applications yet.</p>
          <Button onClick={addRow} variant="default">
            + New Application
          </Button>
        </div>
      ) : isMobile ? (
        <div className="space-y-4">
          {rows.map((data) => (
            <ApplicationCard key={data.application_id} initialData={data} />
          ))}
        </div>
      ) : (
        <Table className="min-w-[1400] border text-sm">
          <TableHeader>
            <TableRow className="bg-gray-100 text-muted-foreground text-sm">
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Job Posting</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Cover Letter</TableHead>
              <TableHead>Transcript</TableHead>
              <TableHead>Match %</TableHead>
              <TableHead>Keyword</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((data) => (
              <ApplicationRow
                key={data.application_id}
                initialData={data}
                onShowKeywordFeedback={handleShowKeywordFeedback}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {/* Bottom Button */}
      {!isEmpty && isMobile && (
        <div className="flex justify-end mt-8">
          <Button
            onClick={addRow}
            variant="outline"
            className="shadow-sm hover:bg-blue-50"
          >
            + New Application
          </Button>
        </div>
      )}

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg w-[600px] max-w-full mx-4 border border-slate-200 text-center">
            <h2 className="text-xl font-semibold mb-6 text-[#0f172a]">
              Keyword Feedback
            </h2>

            <p className="text-sm text-gray-700 font-semibold mb-6">
              💡 You might consider adding the following terms to improve
              alignment:
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {feedbackKeywords.length > 0 ? (
                feedbackKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No missing keywords found.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowFeedbackModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
