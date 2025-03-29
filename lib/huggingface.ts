import { HfInference } from "@huggingface/inference";

export type JobDescription = {
  title: string;
  company: string;
  requirements: string;
  responsibilities?: string;
};

export type CandidateProfile =
  | {
      fullname: string;
      email: string;
      phone: string;
      skills: string[];
      experience: {
        company: string;
        role: string;
        duration: string;
        achievements: string[];
      }[];
      education: {
        degree: string;
        institution: string;
        graduationYear: number;
      }[];
    }
  | string;

export type CoverLetterOptions = {
  tone?: "professional" | "enthusiastic" | "technical";
  length?: "short" | "medium" | "detailed";
};

class CoverLetterGenerator {
  private hf: HfInference;

  constructor(huggingFaceToken: string) {
    this.hf = new HfInference(huggingFaceToken);
  }

  private constructPrompt(
    jobDescription: JobDescription,
    candidateProfile: CandidateProfile,
    options: CoverLetterOptions = {}
  ): string {
    const { tone = "professional", length = "medium" } = options;

    if (typeof candidateProfile === "string") {
      return `
Generate a compelling cover letter with the following context:

Job Details:
- Position: ${jobDescription.title} at ${jobDescription.company}
- Requirements: ${jobDescription.requirements}

Candidate Profile:
- Resume: ${candidateProfile}

Tone: ${tone}
Length Preference: ${length}

Cover Letter Guidelines:
1. Personalize content to job description
2. Highlight matching skills (Regex-based replacement of markdown-style formatting)
3. Show company/role understanding
4. Use ${tone} writing style
5. Aim for ${length} length

Highlighting Guidelines:
- Use **bold** for critical technical skills
- Use *italic* for unique or standout qualifications
- Combine ***bold and italic*** for key achievements
- Emphasize key achievements and expertise
- Be consistent with highlighting
- Don't overuse bold or italic formatting
- Ensure the highlighting adds clarity, not confusion

Desired Outcome:
- Professional, engaging cover letter
- Clear alignment with job requirements
- Showcasing candidate's unique value proposition
- Demonstrate exceptional fit with company culture
- Motivate recruiter's interest
- Create compelling call-to-action

Final Instructions:
- Start with a strong opening statement "Dear Hiring Manager" and end with "Sincerely" or "Best Regards", [candidate name]"
- Craft a narrative that sells candidate's unique value
- Transform professional history into a compelling story
- Make every word count towards securing an interview
- Incorporate relevant keywords to pass applicant tracking systems (ATS)
`;
    }

    return `
Generate a compelling cover letter with the following context:

Job Details:
- Position: ${jobDescription.title} at ${jobDescription.company}
- Key Requirements: ${jobDescription.requirements}

Candidate Profile:
- Name: ${candidateProfile.fullname}
- Email: ${candidateProfile.email}
- Phone: ${candidateProfile.phone}
- Education: ${candidateProfile.education
      .map(
        (edu) => `${edu.degree} from ${edu.institution} (${edu.graduationYear})`
      )
      .join(", ")}
- Professional Skills: ${candidateProfile.skills.join(", ")}
- Recent Experience:\n
    ${candidateProfile.experience
      .map((exp) => {
        return `  - ${exp.role} at ${exp.company} (${exp.duration}), Achievements: ${exp.achievements}`;
      })
      .join("\n    ")}

Tone: ${tone}
Length Preference: ${length}

Cover Letter Guidelines:
1. Personalize content to job description
2. Highlight matching skills (Regex-based replacement of markdown-style formatting)
3. Show company/role understanding
4. Use ${tone} writing style
5. Aim for ${length} length

Highlighting Guidelines:
- Use **bold** for critical technical skills
- Use *italic* for unique or standout qualifications
- Combine ***bold and italic*** for key achievements
- Emphasize key achievements and expertise
- Be consistent with highlighting
- Don't overuse bold or italic formatting
- Ensure the highlighting adds clarity, not confusion

Desired Outcome:
- Professional, engaging cover letter
- Clear alignment with job requirements
- Showcasing candidate's unique value proposition
- Demonstrate exceptional fit with company culture
- Motivate recruiter's interest
- Create compelling call-to-action

Final Instructions:
- Start with a strong opening statement "Dear Hiring Manager" and end with "Sincerely" or "Best Regards", [candidate name]"
- Craft a narrative that sells candidate's unique value
- Transform professional history into a compelling story
- Make every word count towards securing an interview
- Incorporate relevant keywords to pass applicant tracking systems (ATS)
`;
  }

  async generateCoverLetter(
    jobDescription: JobDescription,
    candidateProfile: CandidateProfile,
    options?: CoverLetterOptions
  ): Promise<string> {
    const prompt = this.constructPrompt(
      jobDescription,
      candidateProfile,
      options
    );

    try {
      const response = await this.hf.textGeneration({
        model: "meta-llama/Llama-3.2-3B-Instruct", //"deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          repetition_penalty: 1.2,
        },
      });

      return response.generated_text || "Error generating text.";
    } catch (error) {
      console.error("Cover Letter Generation Error:", error);
      throw new Error("Failed to generate cover letter");
    }
  }

  async generateCoverLetterV2(
    jobDescription: JobDescription,
    resume: string,
    options?: CoverLetterOptions
  ): Promise<string> {
    const prompt = this.constructPrompt(jobDescription, resume, options);
    console.log("prompt", prompt);
    try {
      const response = await this.hf.textGeneration({
        model: "meta-llama/Llama-3.2-3B-Instruct", //"deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          repetition_penalty: 1.2,
        },
      });

      return response.generated_text || "Error generating text.";
    } catch (error) {
      console.error("Cover Letter Generation Error:", error);
      throw new Error("Failed to generate cover letter");
    }
  }
}

export { CoverLetterGenerator };
