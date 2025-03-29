"use client";

import { useState } from "react";
import CoverLetterForm from "@/components/CoverLetterForm";
// import CoverLetterResult from "@/components/CoverLetterResult";

export default function Home() {
  const [, setCoverLetter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCoverLetterGenerated = (letter: string) => {
    setCoverLetter(letter);
    setIsLoading(false);
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        AI Cover Letter Generator
      </h1>

      <CoverLetterForm
        onSubmitStart={() => setIsLoading(true)}
        onCoverLetterGenerated={handleCoverLetterGenerated}
      />

      {isLoading && (
        <div className="text-center my-8">
          <p>Generating your cover letter...</p>
        </div>
      )}

      {/* {coverLetter && <CoverLetterResult coverLetter={coverLetter} />} */}
    </main>
  );
}
