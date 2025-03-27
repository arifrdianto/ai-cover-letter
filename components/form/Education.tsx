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

export default function Education() {
  const form = useFormContext<ApplicationFormValue>();

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  return (
    <>
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">Education</h3>
        <p className="text-sm text-muted-foreground">
          Add your educational background to enhance your profile.
        </p>
      </div>

      <Separator />

      {fields.map((field, index) => (
        <div className="flex flex-col gap-6" key={field.id}>
          <fieldset className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name={`education.${index}.institution`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Institut Teknologi Bandung"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3 ">
              <FormField
                control={form.control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="S.Kom Teknik Informatika"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.graduationYear`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graduation Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2016-2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            degree: "",
            institution: "",
            graduationYear: "",
          })
        }
      >
        Add more
      </Button>
    </>
  );
}
