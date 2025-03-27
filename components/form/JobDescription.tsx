import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ApplicationFormValue } from "@/lib/schema";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

export default function JobDescription() {
  const form = useFormContext<ApplicationFormValue>();

  return (
    <>
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Job Details</h3>
        <p className="text-sm text-muted-foreground">
          Discover the job description and responsibilities.
        </p>
      </div>

      <Separator />

      <FormField
        control={form.control}
        name="jobDescription.title"
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
        name="jobDescription.company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Tesla" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="jobDescription.requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Requirements</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., 5+ years of experience" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="jobDescription.responsibilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsibilities (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Develop scalable web applications"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
