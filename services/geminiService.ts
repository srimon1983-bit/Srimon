
import { GoogleGenAI, Type } from "@google/genai";
import { ContractAnalysis, ChatMessage, ComparisonResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisPayload {
  text?: string;
  fileData?: {
    data: string;
    mimeType: string;
  };
}

export const analyzeContract = async (payload: AnalysisPayload, jurisdiction: string, arbitrationCountry: string): Promise<ContractAnalysis> => {
  const parts: any[] = [
    { text: `Analyze the following contract under the laws of ${jurisdiction}. 
    The chosen seat of arbitration is ${arbitrationCountry}. 
    Provide a detailed breakdown of risks for both Buyer and Seller.
    Suggest fair redline revisions for problematic clauses.` }
  ];

  if (payload.fileData) {
    parts.push({
      inlineData: {
        data: payload.fileData.data,
        mimeType: payload.fileData.mimeType,
      },
    });
  } else if (payload.text) {
    parts.push({ text: `Contract Text:\n${payload.text}` });
  } else {
    throw new Error("No contract content provided.");
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          contractTitle: { type: Type.STRING },
          jurisdiction: { type: Type.STRING },
          overallRiskScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          buyerExposureSummary: { type: Type.STRING },
          sellerExposureSummary: { type: Type.STRING },
          exposures: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                clauseTitle: { type: Type.STRING },
                originalText: { type: Type.STRING },
                riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                impactOnBuyer: { type: Type.STRING },
                impactOnSeller: { type: Type.STRING },
                suggestedRevision: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["clauseTitle", "originalText", "riskLevel", "impactOnBuyer", "impactOnSeller", "suggestedRevision", "explanation"]
            }
          },
          missingClauses: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["contractTitle", "jurisdiction", "overallRiskScore", "summary", "buyerExposureSummary", "sellerExposureSummary", "exposures", "missingClauses"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const compareContracts = async (files: { name: string, data: string, mimeType: string }[], jurisdiction: string, userQuery?: string): Promise<ComparisonResult> => {
  const parts: any[] = [
    { text: `You are an elite International Legal Auditor. Compare the attached ${files.length} contracts under ${jurisdiction} law.
    
    PRIMARY OBJECTIVES:
    1. ASCERTAIN EXPOSURE: Map out financial and operational risks for Buyer and Seller. Point out where one party is heavily exposed due to the other's favorable terms.
    2. SPOT ERRORS: Identify contradictory clauses across the documents, logical failures, missing definitions, or violations of ${jurisdiction} mandatory laws.
    3. CORRECTION & IMPROVEMENT: Provide specific redline suggestions to improve the contract quality, fairness, and legal robustness.
    
    ${userQuery ? `USER SPECIFIC REQUEST: "${userQuery}"` : "GENERAL AUDIT: Review all major commercial terms including Liability, Force Majeure, Termination, and Indemnity."}
    
    Be extremely critical and precise.` }
  ];

  files.forEach((file, index) => {
    parts.push({ text: `--- DOCUMENT ${index + 1}: ${file.name} ---` });
    parts.push({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType,
      }
    });
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          spottedErrors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["Minor", "Major", "Critical"] }
              },
              required: ["location", "description", "severity"]
            }
          },
          suggestedImprovements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalClause: { type: Type.STRING },
                suggestedChange: { type: Type.STRING },
                benefit: { type: Type.STRING }
              },
              required: ["originalClause", "suggestedChange", "benefit"]
            }
          },
          crossContractExposures: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                winner: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                findings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      contractName: { type: Type.STRING },
                      riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                      summary: { type: Type.STRING }
                    },
                    required: ["contractName", "riskLevel", "summary"]
                  }
                }
              },
              required: ["category", "winner", "recommendation", "findings"]
            }
          },
          holisticExposureForParties: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                party: { type: Type.STRING },
                exposureLevel: { type: Type.STRING },
                criticalWarning: { type: Type.STRING }
              },
              required: ["party", "exposureLevel", "criticalWarning"]
            }
          },
          conflictAlerts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "spottedErrors", "suggestedImprovements", "crossContractExposures", "holisticExposureForParties", "conflictAlerts"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const askQuestion = async (
  question: string, 
  history: ChatMessage[], 
  context?: ContractAnalysis
): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({ 
    model, 
    contents: [...history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] })), { role: 'user', parts: [{ text: question }] }],
    config: { 
      systemInstruction: "You are EasyVetContract AI. Be professional and concise.",
      temperature: 0.7 
    } 
  });
  return response.text || "Error processing request.";
};
