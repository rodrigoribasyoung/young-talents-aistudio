import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, Job } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'DEMO_KEY' });

export const analyzeCandidate = async (candidate: Candidate, job: Job): Promise<{ score: number; summary: string }> => {
  // In a real app, this text would come from the parsed PDF resume
  const candidateProfile = `
    Name: ${candidate.name}
    Skills: ${candidate.skills.join(', ')}
    Role Applied: ${candidate.role}
  `;

  const jobDetails = `
    Title: ${job.title}
    Description: ${job.description}
    Requirements: ${job.requirements.join(', ')}
  `;

  const prompt = `
    You are an expert HR Recruiter for Young Empreendimentos.
    Analyze the following candidate against the job description.
    
    Candidate Profile:
    ${candidateProfile}
    
    Job Description:
    ${jobDetails}
    
    Return a JSON object with a 'score' (0-100 integer) and a 'summary' (max 50 words string).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    
    const result = JSON.parse(response.text || '{}');
    return {
      score: result.score || 0,
      summary: result.summary || "Unable to generate summary."
    };
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      score: 0,
      summary: "AI Analysis failed. Please check API Key."
    };
  }
};

export const generateInterviewQuestions = async (candidate: Candidate, job: Job): Promise<string[]> => {
  const prompt = `
    Generate 3 specific, technical, and behavioral interview questions for ${candidate.name} applying for ${job.title}.
    Focus on their skills: ${candidate.skills.join(', ')}.
    Return as a simple JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '[]');
    return Array.isArray(result) ? result : ["Tell me about yourself."];
  } catch (error) {
    console.error("Gemini Questions Failed:", error);
    return ["Tell me about your experience."];
  }
};