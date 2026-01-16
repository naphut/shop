
import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS } from "../constants";

// Fix: Moving instantiation inside functions to comply with guidelines for using the most up-to-date API key.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function smartSearchProducts(query: string, lang: string) {
  // Fix: Create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is searching for: "${query}" in language: ${lang}. 
                 Available products context: ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category })))}.
                 Identify which product IDs best match the query. Even if the user asks for something not in the list (like vegetables), explain gracefully that we only sell shirts, but maybe suggest a shirt that matches the vibe or color.
                 Return your response as a JSON object with a 'matchedIds' array and a 'message' string.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            message: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text || '{"matchedIds":[], "message": "No results found."}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { matchedIds: [], message: "Sorry, I couldn't process that search right now." };
  }
}

export async function expandPrompt(basicIdea: string, lang: string) {
  // Fix: Create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are a professional apparel designer. The user has a basic idea for a shirt design: "${basicIdea}". 
                 Expand this into a detailed "Master Prompt" for a shirt print. 
                 Focus on art style (e.g., cyberpunk, minimalist, oil painting), color palette, composition, and mood.
                 Provide the response in ${lang}.
                 Return JSON with a 'proPrompt' string and a 'shortDescription' string.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            proPrompt: { type: Type.STRING },
            shortDescription: { type: Type.STRING }
          }
        }
      }
    });
    const text = response.text || `{"proPrompt": "${basicIdea}", "shortDescription": "Custom AI Design"}`;
    return JSON.parse(text);
  } catch (error) {
    console.error("Prompt Expansion Error:", error);
    return { proPrompt: basicIdea, shortDescription: "Custom AI Design" };
  }
}

export async function generateDesignImage(prompt: string) {
  // Fix: Create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `High-quality, professional apparel graphic design print on a clean white background: ${prompt}. Minimalist, artistic, and suitable for a t-shirt.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}

export async function getProductRecommendation(cartItems: any[]) {
  // Fix: Create a new instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user has these items in their cart: ${JSON.stringify(cartItems)}. 
                 Based on the available products ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category })))}, 
                 recommend ONE product ID that complements their cart and explain why.
                 Return as JSON with 'recommendedId' and 'reason'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedId: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    });
    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}
