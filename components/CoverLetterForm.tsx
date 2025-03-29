"use client";

import { useState, FormEvent } from "react";

interface CoverLetterFormProps {
  onSubmitStart: () => void;
  onCoverLetterGenerated: (coverLetter: string) => void;
}

export default function CoverLetterForm({
  onSubmitStart,
  onCoverLetterGenerated,
}: CoverLetterFormProps) {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!resume || !jobDescription) {
      setError("Please provide both a resume and job description");
      return;
    }

    setError("");
    onSubmitStart();

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("/api/gen", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const data = await response.json();
      onCoverLetterGenerated(data.coverLetter);
    } catch (error) {
      setError("Error generating cover letter. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="mb-6">
        <label htmlFor="resume" className="block mb-2 font-medium">
          Upload Resume (PDF)
        </label>
        <input
          type="file"
          id="resume"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
          className="block w-full text-sm border border-gray-300 rounded-lg
                   cursor-pointer bg-gray-50 focus:outline-none p-2.5"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="jobDescription" className="block mb-2 font-medium">
          Job Description
        </label>
        <textarea
          id="jobDescription"
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="block p-2.5 w-full text-sm rounded-lg border border-gray-300
                   focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste the job description here..."
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
                 focus:ring-blue-300 font-medium rounded-lg text-sm px-5
                 py-2.5 text-center"
      >
        Generate Cover Letter
      </button>
    </form>
  );
}
