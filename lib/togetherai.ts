import TogetherAI from "together-ai";

class TogetherAIClient {
  private client: TogetherAI;

  constructor(apiKey: string) {
    this.client = new TogetherAI({ apiKey });
  }

  /**
   * Generates text using TogetherAI's API.
   * @param {string} userMessage - The user input for the AI.
   * @param {string} model - The TogetherAI model to use (default: meta-llama/Llama-3.3-70B-Instruct-Turbo).
   * @param {number} maxTokens - Maximum tokens for the response (default: 500).
   * @param {number} temperature - Controls randomness (default: 0.7).
   * @returns {Promise<string>} - The AI-generated text.
   */

  public async generateCoverLetter({
    userMessage,
    model = "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    maxTokens = 500,
    temperature = 0.7,
  }: {
    systemMessage?: string;
    userMessage: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an AI that generates professional and compelling cover letters.",
          },
          { role: "user", content: userMessage },
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
