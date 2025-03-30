import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { InputTags } from "../ui/input-tags";
import { ApplicationFormValue } from "@/lib/schema";

export default function Profile() {
  const form = useFormContext<ApplicationFormValue>();

  return (
    <>
      <FormField
        control={form.control}
        name="fullname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Marteen Paes" {...field} />
            </FormControl>
            <FormDescription>
              Enter your full legal name as it appears on official documents.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input
                placeholder="marteen.paes@example.com"
                inputMode="email"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                placeholder="+62 812-3456-7890"
                inputMode="tel"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Key Skills</FormLabel>
            <FormControl>
              <InputTags
                placeholder="e.g., Next.js, React, TypeScript"
                aria-description="List your top technical and professional skills, separated by commas or Enter."
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
