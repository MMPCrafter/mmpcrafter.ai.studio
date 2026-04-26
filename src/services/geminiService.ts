import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, GeneratedContent } from "../types";

function getAIClient() {
  const userKey = localStorage.getItem('MMPCRAFTER_GEMINI_KEY');
  const apiKey = userKey || process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("API_KEY_MISSING");
  }
  
  return new GoogleGenAI({ apiKey });
}

const MINECRAFT_EXPERT_SYSTEM_PROMPT = `You are MMPCRAFTER AI, a professional Minecraft expert and developer. 
You can help users with everything Minecraft: survival tips, redstone engineering, command blocks, modding concepts, skin design ideas, and bedrock add-on development.

Always be helpful and enthusiastic about Minecraft. 
IMPORTANT: The user may speak Burmese (မြန်မာဘာသာ). If they speak Burmese, respond in a mix of Burmese and English terms for technical Minecraft concepts, or strictly Burmese if it makes sense.
Be culturally aware of the Myanmar Minecraft community.`;

export async function chatWithAI(messages: Message[]) {
  try {
    const ai = getAIClient();
    const contents = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: MINECRAFT_EXPERT_SYSTEM_PROMPT,
      },
      tools: [
        { googleSearch: {} }
      ]
    });

    return response.text || "Sorry, I couldn't process that.";
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    if (error.message === "API_KEY_MISSING") {
      return "မြန်မာ: Gemini API Key မရှိသေးပါ။ ကျေးဇူးပြု၍ Settings တွင် သင်၏ API Key ကို ထည့်သွင်းပါ။ (API Key is missing. Please add your key in Settings.)";
    }
    if (error.message?.includes("PERMISSION_DENIED") || error.status === "PERMISSION_DENIED") {
      return "မြန်မာ: သင်၏ API Key သည် ဤ Chat Model ကို အသုံးပြုခွင့် မရှိသေးပါ။ (Access denied. Your API Key might not have permission for this model.)";
    }
    if (error.message?.includes("Rpc failed") || error.message?.includes("xhr error")) {
      return "မြန်မာ: ဆာဗာနှင့် ချိတ်ဆက်မှု ခေတ္တပြတ်တောက်နေပါသည်။ ခေတ္တစောင့်ပြီး ပြန်လည်ကြိုးစားပေးပါ။ (Connection to AI server failed. Please wait a moment and try again.)";
    }
    throw error;
  }
}

export async function generateMinecraftConcept(type: string, prompt: string): Promise<GeneratedContent> {
  try {
    const ai = getAIClient();
    const isImageTask = type === 'photo' || type === 'skin';
    
    if (isImageTask) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [{ text: `Generate a high quality Minecraft ${type === 'skin' ? 'character skin texture map or preview' : 'scenery / block screenshot'} based on: ${prompt}` }]
        }
      });

      let imageUrl = '';
      let textContent = '';
      
      const candidates = response.candidates || [];
      if (candidates.length > 0) {
        const parts = candidates[0].content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            textContent += part.text;
          }
        }
      }

      return {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Generation`,
        description: textContent || `Your Minecraft ${type} has been generated!`,
        imageUrl: imageUrl || undefined
      };
    }

  const systemPrompt = `You are a Minecraft ${type} generator. 
Generate a detailed concept for a ${type} based on the user's prompt.
If the prompt mentions "hardcore", provide extremely detailed technical implementations including full JSON manifests, behavior logic, or Java class structures.

Provide the response in JSON format (without markdown backticks) with:
- title: A cool name for the ${type}.
- description: A detailed description of what it does and how it looks.
- code: If it's a mod, add-on, or command-related thing, provide valid Minecraft code (JSON for add-ons, Java code for mods, or complex Minecraft commands). 
If possible, explain things in Burmese (မြန်မာဘာသာ) as well.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json"
    },
    tools: [
      { googleSearch: {} }
    ]
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {
      title: "Generation Error",
      description: response.text || "Failed to parse JSON response."
    };
  }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    if (error.message === "API_KEY_MISSING") {
      return {
        title: "API Key Missing",
        description: "ကျေးဇူးပြု၍ Settings တွင် API Key ထည့်ပေးပါ။ (Please provide an API Key in settings.)"
      };
    }
    let errorMessage = "AI Generation failed.";
    if (error.message?.includes("PERMISSION_DENIED") || error.status === "PERMISSION_DENIED") {
      errorMessage = "သင်၏ API Key သည် ဤ AI model ကို အသုံးပြုခွင့် မရှိသေးပါ။ ကျေးဇူးပြု၍ Settings တွင် Key အသစ်ထည့်သွင်းကြည့်ပါ။ (Access denied. Your API Key might not have permission for this model. Try a different key in Settings.)";
    } else if (error.message?.includes("Rpc failed") || error.message?.includes("xhr error")) {
      errorMessage = "ချိတ်ဆက်မှု အဆင်မပြေဖြစ်နေပါသည်။ (AI server connection failed. Please try again later.)";
    }
    return {
      title: "Connection Error",
      description: errorMessage
    };
  }
}
