"use client";

import {
  ApplicationFormValue,
  applicationSchema,
  schemaIndex,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { useStepForm } from "@/hooks/useStepForm";
import { FormWizard } from "./form";
import { useSession } from "next-auth/react";

export type Result =
  | "loading"
  | {
      error?: string;
      message: string;
      data:
        | (ApplicationFormValue & {
            generatedText: string;
          })
        | null;
    }
  | null;

type FormBuilderProps = {
  onFinish: (res: Result) => void;
};

export default function FormBuilder({ onFinish }: FormBuilderProps) {
  const session = useSession();

  const { currentStepIndex, isFirstStep, isLastStep, nextStep, previousStep } =
    useStepForm(schemaIndex.length);

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      skills: [],
      education: [
        {
          degree: "",
          institution: "",
          graduationYear: "",
        },
      ],
      experience: [
        {
          company: "",
          role: "",
          duration: "",
          achievements: "",
        },
      ],
      jobDescription: {
        title: "",
        company: "",
        requirements: "",
        responsibilities: "",
      },
    },
  });

  if (session.data) {
    async function getProfile() {
      const profile = await fetch(`/api/me`);
      const profileJson = await profile.json();
      form.setValue("fullname", profileJson.name);
      form.setValue("email", profileJson.email);
    }
    getProfile();
  }

  const onSubmit = async (data: ApplicationFormValue) => {
    onFinish("loading");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription: data.jobDescription,
          candidateProfile: {
            name: data.fullname,
            email: data.email,
            phone: data.phone,
            skills: data.skills,
            experience: data.experience,
            education: data.education,
          },
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        onFinish({
          error: result.error,
          message: result.message,
          data: null,
        });
        return;
      }

      onFinish(result);
    } catch (error) {
      if (error instanceof Error) {
        onFinish({
          error: "Error generating cover letter",
          message: error.message,
          data: null,
        });
      }
      onFinish({
        error: "Error generating cover letter",
        message: String(error),
        data: null,
      });
    }
  };

  const fieldToTrigger = schemaIndex[
    currentStepIndex
  ] as unknown as FieldPath<ApplicationFormValue>;

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLastStep) {
      form.handleSubmit(onSubmit)();
      return;
    }

    form.trigger(fieldToTrigger).then((isValid) => {
      if (isValid) {
        nextStep();
      }
    });
  };

  const Content = FormWizard[currentStepIndex];

  return (
    <Form {...form}>
      <form
        onSubmit={handleOnSubmit}
        className="flex flex-col gap-6 h-[calc(100%-72px)] w-full"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto relative">
          <div className="flex flex-col gap-6 overflow-visible relative px-1">
            <Content />
          </div>
        </div>
        <div className="w-full items-center flex justify-between">
          <Button
            onClick={previousStep}
            type="button"
            variant="ghost"
            className={`${isFirstStep ? "invisible" : "visible"}`}
          >
            Go Back
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {isLastStep ? "Confirm" : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
