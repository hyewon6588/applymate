"use client";

import ApplicationTable from "@/components/ApplicationTable";

export default function ApplicationsPage() {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-semibold text-center mb-4">
        My Applications
      </h1>
      <ApplicationTable />
    </main>
  );
}
