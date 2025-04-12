"use client";

import { useState } from "react";
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

export default function ApplicationTable() {
  const [rows, setRows] = useState<number[]>([]);
  const addRow = () => setRows((prev) => [...prev, Date.now()]);
  const isMobile = useIsMobile();

  const isEmpty = rows.length === 0;

  return (
    <div className="w-full overflow-x-auto px-2 sm:px-4">
      {/* Top Button */}
      {!isEmpty && !isMobile && (
        <div className="flex justify-end mb-6">
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
          {rows.map((key) => (
            <ApplicationCard key={`card-${key}`} />
          ))}
        </div>
      ) : (
        <Table className="w-full border text-sm">
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
            {rows.map((key) => (
              <ApplicationRow key={key} />
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
    </div>
  );
}
