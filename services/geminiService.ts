import { GoogleGenAI, Type } from "@google/genai";
import { CartItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getAISuggestions = async (
  cartItems: CartItem[]
): Promise<string[]> => {
  if (cartItems.length === 0) {
    return [];
  }

  const productNames = cartItems.map(item => item.product.name).join(', ');

  let prompt = `You are a helpful supermarket assistant. Based on the items in the shopping cart (${productNames}), suggest 3 additional products the customer might like.`;
  
  prompt += ` Only return a JSON array of strings with the product names. For example: ["Organic Pasta Sauce", "Parmesan Cheese", "Garlic Bread"]. Do not include any other text or markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                    description: "A product suggestion"
                }
            }
        }
    });
    
    const responseText = response.text.trim();
    const suggestions = JSON.parse(responseText);

    if (Array.isArray(suggestions) && suggestions.every(item => typeof item === 'string')) {
      return suggestions;
    }
    console.warn("AI response was not in the expected format:", responseText);
    return [];

  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    // Fallback in case of parsing error or API failure
    return ["Milk", "Bread", "Eggs"]; 
  }
};