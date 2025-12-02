import { GoogleGenAI, Type } from "@google/genai";
import { Candidate, Job } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'DEMO_KEY' });

export const analyzeCandidate = async (candidate: Candidate, job: Job): Promise<{ score: number; summary: string }> => {
  // Dados do candidato formatados para o prompt
  const candidateProfile = `
    Nome: ${candidate.name}
    Habilidades/Formação: ${candidate.skills.join(', ')}
    Experiência: ${candidate.experience || 'Não informado'}
    Educação: ${candidate.education || 'Não informado'}
    Resumo Pessoal: ${candidate.aboutMe || 'Não informado'}
    Vaga Aplicada: ${candidate.role}
  `;

  const jobDetails = `
    Título: ${job.title}
    Descrição: ${job.description}
    Requisitos: ${job.requirements.join(', ')}
  `;

  const prompt = `
    Você é um Recrutador de RH especialista da Young Empreendimentos (Young Talents).
    Analise o seguinte candidato em relação à descrição da vaga.
    
    Perfil do Candidato:
    ${candidateProfile}
    
    Descrição da Vaga:
    ${jobDetails}
    
    Retorne um objeto JSON com:
    - 'score' (inteiro de 0-100 indicando a aderência à vaga)
    - 'summary' (string de no máximo 60 palavras em Português do Brasil, resumindo os pontos fortes e fracos).
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
      summary: result.summary || "Não foi possível gerar o resumo."
    };
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      score: 0,
      summary: "Falha na análise da IA. Verifique a chave da API."
    };
  }
};

export const generateInterviewQuestions = async (candidate: Candidate, job: Job): Promise<string[]> => {
  const prompt = `
    Gere 3 perguntas de entrevista específicas, técnicas e comportamentais para ${candidate.name} que está se candidatando para ${job.title}.
    Foque nas habilidades mencionadas: ${candidate.skills.join(', ')}.
    Retorne apenas um array JSON simples de strings em Português do Brasil.
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
    return Array.isArray(result) ? result : ["Fale um pouco sobre você."];
  } catch (error) {
    console.error("Gemini Questions Failed:", error);
    return ["Fale um pouco sobre sua experiência."];
  }
};