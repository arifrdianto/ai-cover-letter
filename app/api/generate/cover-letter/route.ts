import TogetherAIClient from "@/lib/togetherai";
import pdfParse from "pdf-parse";

const togetherAIClient = new TogetherAIClient(
  process.env.TOGETHER_API_KEY as string
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const companyName = formData.get("company") as string;
    const jobRequirements = formData.get("requirements") as string;

    if (!resumeFile) {
      return Response.json(
        { error: "Bad Request!", message: "Missing file resume (*.pdf)" },
        { status: 400 }
      );
    }

    if (!jobTitle || !companyName || !jobRequirements) {
      return Response.json(
        {
          error: "Bad Request!",
          message: "Missing job title, company name, or job requirements",
        },
        { status: 400 }
      );
    }
    // Check if the file is a PDF
    if (resumeFile.type !== "application/pdf") {
      return Response.json(
        {
          error: "Bad Request!",
          message: "Invalid file type. Please upload a PDF.",
        },
        { status: 400 }
      );
    }
    // Check if the file size exceeds 5MB
    if (resumeFile.size > 5 * 1024 * 1024) {
      return Response.json(
        {
          error: "Bad Request!",
          message: "File size exceeds 5MB. Please upload a smaller file.",
        },
        { status: 400 }
      );
    }
    // Check if the file is empty
    if (resumeFile.size === 0) {
      return Response.json(
        {
          error: "Bad Request!",
          message: "File is empty. Please upload a valid PDF.",
        },
        { status: 400 }
      );
    }

    // Convert File object to Buffer
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const extractedResume = pdfData.text;

    const coverLetter = await togetherAIClient.generateCoverLetter({
      resumeText: extractedResume,
      jobDetail: {
        title: jobTitle,
        company: companyName,
        requirements: jobRequirements,
      },
    });

    return Response.json({
      data: {
        jobDescription: {
          company: companyName,
          title: jobTitle,
          requirements: jobRequirements,
        },
        generatedText: coverLetter,
      },
      message: "Cover letter generated successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        {
          error: "Error generating cover letter",
          message: error.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        error: "Error generating cover letter",
        message: String(error),
      },
      { status: 500 }
    );
  }
}
