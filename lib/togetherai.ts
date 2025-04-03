import TogetherAI from "together-ai";

export type JobDetail = {
  title: string;
  company: string;
  requirements: string;
};
class TogetherAIClient {
  private client: TogetherAI;

  constructor(apiKey: string) {
    this.client = new TogetherAI({ apiKey });
  }

  private constructorPrompt(
    extractedResume: string,
    jobDetail: JobDetail
  ): string {
    return `
Here is my CV:
${extractedResume}

I am applying for the position of ${jobDetail.title} at ${jobDetail.company}. Below is the job description:

${jobDetail.requirements}

Please generate a tailored cover letter for this job.

Ensure that the cover letter:
- Includes my name, email, and phone number.
- Is professional, concise, and well-structured.
- Incorporate relevant keywords to pass applicant tracking systems (ATS).

Highlights guidelines:
1. Personalize content to job description
2. Use a professional tone
3. Highlight relevant skills and experiences
4. Show understanding of the company and role
5. Use clear and concise language
6. Aim for a length of 1-2 pages
7. Include a strong opening and closing statement
8. Use proper formatting and structure
9. Avoid generic phrases and clichés
10. Use active voice and strong action verbs
11. Include specific examples of achievements
12. Tailor the content to the specific job and company
13. Use a friendly and approachable tone
14. Avoid jargon and technical terms unless necessary

Desired Outcome:
- Professional, engaging cover letter
- Clear alignment with job requirements
- Showcasing candidate's unique value proposition
- Demonstrate exceptional fit with company culture
- Motivate recruiter's interest
- Create compelling call-to-action
- Output in markdown format with proper formatting highlighting
- Use **bold** for critical technical skills
- Use *italic* for unique or standout qualifications
- Combine ***bold and italic*** for key achievements
- Emphasize key achievements and expertise
`;
  }

  /**
   * Generates text using TogetherAI's API.
   * @param {string} resumeText - The resume text to use as context.
   * @param {JobDetail} jobDetail - The job details to use for generating the cover letter.
   * @param {string} model - The TogetherAI model to use (default: meta-llama/Llama-3.3-70B-Instruct-Turbo).
   * @param {number} maxTokens - Maximum tokens for the response (default: 500).
   * @param {number} temperature - Controls randomness (default: 0.7).
   * @returns {Promise<string>} - The AI-generated text.
   */

  public async generateCoverLetter({
    resumeText,
    jobDetail,
    model = "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    maxTokens,
    temperature = 0.7,
  }: {
    resumeText: string;
    jobDetail: JobDetail;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<string> {
    try {
      const prompt = this.constructorPrompt(resumeText, jobDetail);
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an AI that generates professional and compelling cover letters.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: maxTokens,
        temperature,
      });

      console.log(
        "TogetherAI response:",
        response.choices[0]?.message?.content
      );

      return response.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
      console.error("TogetherAI API error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Error generating text: An unknown error occurred.");
      }
    }
  }
}
export default TogetherAIClient;
