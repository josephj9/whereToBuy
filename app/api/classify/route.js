import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { image } = await req.json();
  if (!image) {
    return new Response(JSON.stringify({ error: "Missing image data" }), { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this image and return a JSON object with:
      {
        "main_category": "",
        "specific_category": "",
        "display_name": "",
        "confidence": "",
        "color": "",
        "icon": ""
      }
    `;

    let base64 = image.startsWith("data:") ? image.split(",")[1] : image;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64,
        },
      },
    ]);
    let text = result.response.text();

    let json;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      json = JSON.parse(match ? match[0] : text);
    } catch {
      json = { raw: text };
    }

    return new Response(JSON.stringify(json), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}