import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic, rules } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Gere uma mensagem profissional e cordial para WhatsApp sobre os seguintes imóveis: ${topic}. 

        Observações:
        - Eu sou um corretor de imóveis e estou enviando mensagens para os proprietários dos imóveis
        - Não precisa falar que é um corretor de imóveis
        
        Regras:
        - ${rules ?? ''}
        - Mantenha um tom educado e profissional
        - Pergunte se o imóvel ainda está disponível
        - Solicite informações atualizadas sobre valores e condições
        - Gere apenas a mensagem final, sem explicações
        - Não use emojis ou linguagem informal
        - Crie uma mensagem para cada imóvel, não misture os imóveis na mesma mensagem
        - No resultado final divida as mensagens por imóvel
        - Limite a mensagem a 2-3 parágrafos curtos`
    });

    console.log(response.text);

    res.status(200).json({
      question: response.text
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
