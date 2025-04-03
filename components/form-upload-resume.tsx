"use client";

import {
  ApplicationFormValue,
  ApplicationFormValueWithUpload,
  applicationSchemaWithUpload,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FileUpload } from "./ui/file-upload";

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

type FormUploadResumeProps = {
  onFinish: (res: Result) => void;
};

export default function FormUploadResume({ onFinish }: FormUploadResumeProps) {
  const form = useForm({
    resolver: zodResolver(applicationSchemaWithUpload),
    defaultValues: {
      resume: undefined,
      jobTitle: "",
      company: "",
      requirements: "",
    },
  });

  const onSubmit = async (data: ApplicationFormValueWithUpload) => {
    onFinish("loading");

    try {
      // Create a new FormData instance
      const formData = new FormData();

      // Dynamically append fields to FormData based on data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "resume" && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const res = await fetch(`/api/generate/cover-letter`, {
        method: "POST",
        body: formData,
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

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleOnSubmit}
        className="flex flex-col gap-6 w-full md:h-[calc(100vh-25.5rem)]"
      >
        <div className="flex flex-col gap-6 md:overflow-auto relative md:min-h-full">
          <div className="flex flex-col gap-6 overflow-visible relative px-1">
            <FormField
              control={form.control}
              name="resume"
              render={({ field, fieldState: { invalid } }) => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <FormControl>
                    <FileUpload
                      accept=".pdf,.doc,.docx"
                      {...field}
                      onChange={(files) => {
                        // When files are selected, pass the first file to the form
                        if (files && files.length > 0) {
                          field.onChange(files[0]);
                        } else {
                          field.onChange(undefined);
                        }
                      }}
                      aria-invalid={invalid}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a document in PDF format.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="CodeSphere Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Descriptions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 5+ years of experience"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="w-full items-center flex justify-between">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Generate Cover Letter
          </Button>
        </div>
      </form>
    </Form>
  );
}
