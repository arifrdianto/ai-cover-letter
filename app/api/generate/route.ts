import { CoverLetterGenerator } from "@/lib/huggingface";

export async function POST(req: Request) {
  if (req.headers.get("content-type") !== "application/json")
    return Response.json({ error: "Invalid content type" }, { status: 400 });

  const { jobDescription, candidateProfile, ...options } = await req.json();

  if (!jobDescription || !candidateProfile)
    return Response.json({ error: "Missing required fields" }, { status: 400 });

  try {
    const coverLetterGenerator = new CoverLetterGenerator(
      process.env.HUGGINGFACE_API_KEY!
    );

    const coverLetter = await coverLetterGenerator.generateCoverLetter(
      jobDescription,
      candidateProfile,
      options
    );

    console.log("Cover Letter", coverLetter);

    return Response.json({
      data: {
        ...candidateProfile,
        jobDescription,
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
