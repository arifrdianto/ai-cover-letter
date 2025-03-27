import Markdown from "react-markdown";

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jobDescription: {
        title: "Senior Fullstack Engineer",
        company: "ByteDance",
        requirements: [
          "Proven experience as a Fullstack Engineer, with a minimum of 5 years in web development",
          "Strong proficiency in frontend technologies, including HTML, CSS, JavaScript, and modern frameworks such as React, Angular, or Vue.js",
          "Expertise in backend technologies like Node.js, Python, or Java",
          "Solid understanding of database technologies, both SQL and NoSQL",
          "Experience designing and implementing RESTful APIs and microservices architecture",
          "Familiarity with cloud platforms such as AWS, Azure, or GCP",
          "Proficiency in version control systems, particularly Git",
          "Experience with CI/CD pipelines and DevOps practices",
          "Bachelor's degree in Computer Science, Software Engineering, or a related field",
          "Strong problem-solving skills and attention to detail",
          "Excellent communication and teamwork abilities",
          "Knowledge of Agile methodologies and software development best practices",
          "Ability to work efficiently in a fast-paced environment",
        ],
        responsibilities: [
          "Develop scalable web applications",
          "Implement machine learning features",
        ],
      },
      candidateProfile: {
        name: "Marteen Paes",
        email: "kevin@example.com",
        phone: "+62 812-3456-7890",
        skills: [
          "Next.js",
          "React",
          "TypeScript",
          "AI Integration",
          "Node.js",
          "Supabase",
          "CI/CD",
        ],
        experience: [
          {
            company: "GoTo Financial",
            role: "Frontend Engineer",
            duration: "2020-2023",
            achievements: [
              "Implemented AI-driven features",
              "Optimized web application performance",
              "Collaborated with cross-functional teams",
              "Mentored junior developers",
            ],
          },
          {
            company: "Traveloka",
            role: "Software Engineer",
            duration: "2018-2020",
            achievements: [
              "Developed scalable web applications",
              "Integrated third-party APIs for enhanced functionality",
            ],
          },
        ],
        education: [
          {
            degree: "S.Kom Teknik Informatika",
            institution: "Institut Teknologi Bandung",
            graduationYear: 2020,
          },
          {
            degree: "Diploma Teknik Informatika",
            institution: "Politeknik Negeri Jakarta",
            graduationYear: 2016,
          },
        ],
      },
    }),
  });

  const data = await res.json();

  // Parse the raw text response into structured paragraphs
  const parseCoverLetterContent = (rawContent: string): string[] => {
    // Split by double newlines to separate paragraphs
    return rawContent
      .split("\n\n")
      .filter((paragraph) => paragraph.trim() !== "")
      .map((paragraph) => paragraph.trim());
  };

  const parseRawText = (rawText: string, name: string) => {
    // Split context section
    const contextMatch = rawText.match(
      /Generate a compelling cover letter with the following context:(.*?)Cover Letter Guidelines:/s
    );
    const context = contextMatch ? contextMatch[1].trim() : "";

    // Extract letter body
    const letterBodyMatch = rawText.match(
      new RegExp(`Dear Hiring Manager,(.*?)(${name})`, "s")
    );
    const letterBody = letterBodyMatch ? letterBodyMatch[1].trim() : "";

    return {
      context,
      letterBody: parseCoverLetterContent(letterBody),
    };
  };

  const parsedContent = parseRawText(
    data.data.generatedText,
    data.data.profile.name
  );

  return (
    <div>
      <h1>AI-Generated Cover Letter</h1>
      {/* <section>
        <h2>Job & Candidate Context</h2>
        <p>{parsedContent.context}</p>
      </section> */}
      <section>
        <h2>Cover Letter</h2>
        <p>Dear Hiring Manager,</p>
        {parsedContent.letterBody.map((paragraph, index) => (
          // <p key={index} className="leading-relaxed mb-2">
          <Markdown key={index}>{paragraph}</Markdown>
          // </p>
        ))}
        <p>{data.data.profile.name}</p>
      </section>
    </div>
  );
}
