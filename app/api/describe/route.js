import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { display_name, specific_category } = await req.json();

  // Build the prompt using classification result
  const prompt = `Write a concise product description for a ${display_name} (${specific_category}).`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const description = result.response.text();
    return new Response(JSON.stringify({ description }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}