import { ApplicationFormValue } from "@/lib/schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function Experience() {
  const form = useFormContext<ApplicationFormValue>();

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  return (
    <>
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Experience</h3>
        <p className="text-sm text-muted-foreground">
          Add your professional experience to enhance your profile.
        </p>
      </div>

      <Separator />

      {fields.map((field, index) => (
        <div className="flex flex-col gap-6" key={field.id}>
          <fieldset className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name={`experience.${index}.company`}
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
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name={`experience.${index}.role`}
                render={({ field }) => (
                  <FormItem className="col-span-1">
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
                name={`experience.${index}.duration`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="Jan 2016 - April 2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={`experience.${index}.achievements`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Developed scalable web applications"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="w-[fit-content]"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            )}
          </fieldset>
          <Separator />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-[fit-content]"
        onClick={() =>
          append({
            company: "",
            role: "",
            duration: "",
            achievements: "",
          })
        }
      >
        Add more
      </Button>
    </>
  );
}
