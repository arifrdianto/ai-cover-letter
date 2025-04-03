import { z } from "zod";

const jobDescriptionSchema = z.object({
  title: z.string().nonempty("Title is required"),
  company: z.string().nonempty("Company is required"),
  requirements: z.string().nonempty("Requirements is required"),
  responsibilities: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  duration: z.string(),
  achievements: z.string(),
});

const educationSchema = z.object({
  degree: z.string(),
  institution: z.string().nonempty("Institution is required"),
  graduationYear: z.string(),
});

const profileSchema = z.object({
  fullname: z.string().nonempty("Fullname is required"),
  email: z.string().email(),
  phone: z.string(),
  skills: z.array(z.string()),
});

const groupSchema = z.object({
  education: z.array(educationSchema),
  experience: z.array(experienceSchema).min(1),
  jobDescription: jobDescriptionSchema,
});

const applicationSchema = profileSchema.merge(groupSchema);
const applicationSchemaWithUpload = z.object({
  resume: z
    .instanceof(File)
    .refine((file) => file.size < 5 * 1024 * 1024, {
      message: "File size exceeds 5MB",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "File must be a PDF",
    }),
  jobTitle: z.string().nonempty("Title is required"),
  company: z.string().nonempty("Company is required"),
  requirements: z.string().nonempty("Requirements is required"),
});

const schemaIndex = [
  Object.keys(profileSchema.shape),
  ...Object.keys(groupSchema.shape),
];

export type ApplicationFormValue = z.infer<typeof applicationSchema>;
export type ApplicationFormValueWithUpload = z.infer<
  typeof applicationSchemaWithUpload
>;

export { applicationSchema, applicationSchemaWithUpload, schemaIndex };
