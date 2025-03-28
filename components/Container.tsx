"use client";

import { useState } from "react";
import FormBuilder, { Result } from "./FormBuilder";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import Markdown from "react-markdown";
import LinkedinConnect from "./LinkedinConnect";

export default function Container() {
  const [generatedText, setGeneratedText] = useState<Result>(null);

  return (
    <div className="container mx-auto w-full max-w-[1280px]">
      <div className="flex-1 items-start mx-6 md:mx-4 md:grid md:grid-cols-[320px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-10">
        <aside className="top-14 z-30 h-[calc(100vh-8rem)] w-full shrink-0 md:sticky py-6 md:py-0">
          <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium">
                Elevate Your Profile with AI-Powered Precision 🚀
              </h3>
              <p className="text-sm text-muted-foreground">
                Craft compelling and personalized cover letters
                effortlessly—your journey to the perfect job starts here!
              </p>
            </div>
            <LinkedinConnect />
            <Separator />
            <FormBuilder onFinish={setGeneratedText} />
          </div>
        </aside>
        <main className="relative py-8">
          <Card>
            <CardContent>
              {typeof generatedText !== "string" && generatedText?.error && (
                <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-8rem)]">
                  <p className="text-8xl">🚨</p>
                  <div className="text-center space-y-1">
                    <h1 className="text-lg font-bold">An error occurred</h1>
                    <p className="text-sm text-gray-500">
                      {generatedText.message}
                    </p>
                  </div>
                </div>
              )}
              {generatedText === "loading" && (
                <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-8rem)]">
                  <p className="text-8xl">🚀</p>
                  <div className="text-center space-y-1">
                    <h1 className="text-lg font-bold">Generating...</h1>
                    <p className="text-sm text-gray-500">
                      Please wait while we generate your cover letter.
                    </p>
                  </div>
                </div>
              )}
              {typeof generatedText === "object" && !!generatedText?.data && (
                <Markdown>{generatedText.data?.generatedText}</Markdown>
              )}
              {generatedText === null && (
                <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-8rem)]">
                  <p className="text-8xl">🪄</p>
                  <div className="text-center space-y-1">
                    <h1 className="text-lg font-bold">
                      Cover Letter AI-Generation
                    </h1>
                    <p className="text-sm text-gray-500">
                      Generate a cover letter using AI. Fill out the form on the
                      left to get started.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
