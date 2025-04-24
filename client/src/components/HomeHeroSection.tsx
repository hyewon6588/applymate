"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function HomeHeroSection() {
  const handleScroll = () => {
    const el = document.getElementById("feature-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
      {/* Content block */}
      <div className="z-10 flex flex-col items-center justify-center mt-[-40px]">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Apply Smarter, Not Harder
        </h1>

        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          ApplyMate helps you organize your job applications and improve your
          resume match with AI-powered insights.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-16">
          <Link
            href="/signup"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition shadow-md hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg hover:bg-neutral-100 transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Scroll cue (clickable scroll-to-feature trigger) */}
      <div
        className="absolute bottom-24 inset-x-0 flex flex-col items-center justify-center z-20 cursor-pointer"
        onClick={handleScroll}
      >
        <ChevronDown className="w-6 h-6 text-gray-500 animate-bounce" />
        <p className="text-sm mt-1 text-gray-500">Scroll to explore</p>
      </div>
    </section>
  );
}
