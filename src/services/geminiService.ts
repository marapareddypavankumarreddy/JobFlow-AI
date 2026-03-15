import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async tailorResume(baseResume: string, jobDescription: string) {
    const prompt = `
      You are an expert career coach and ATS optimization specialist.
      
      BASE RESUME:
      ${baseResume}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      TASK:
      Rewrite the resume to perfectly align with the job description. 
      - Highlight relevant skills and experiences.
      - Use keywords from the job description naturally.
      - Maintain the original truthfulness of the resume but rephrase for maximum impact.
      - Output the result in clean Markdown format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
  },

  async generateCoverLetter(baseResume: string, jobDescription: string) {
    const prompt = `
      You are an expert career coach.
      
      BASE RESUME:
      ${baseResume}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      TASK:
      Write a compelling, professional, and personalized cover letter for this job.
      - Focus on how the candidate's specific skills solve the company's problems mentioned in the JD.
      - Keep it concise (under 300 words).
      - Output in clean Markdown format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
  },

  async calculateMatchScore(baseResume: string, jobDescription: string) {
    const prompt = `
      Analyze the match between this resume and job description.
      
      RESUME:
      ${baseResume}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      TASK:
      Provide a match score from 0 to 100 and a brief justification.
      Return ONLY a JSON object: { "score": number, "justification": "string" }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { score: 0, justification: "Failed to parse score" };
    }
  }
};
