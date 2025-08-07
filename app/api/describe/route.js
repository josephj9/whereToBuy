import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from '@/app/lib/mongodb'
import Product from '@/app/models/Product'
import mongoose from "mongoose";

export async function POST(req) {
  const { display_name, specific_category } = await req.json();
  await connectDB();
  // Build the prompt using classification result
  const prompt = `Write a concise product description for a ${display_name} (${specific_category}).`;

  //post to the database here.
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const description = result.response.text();

    const newProduct = await Product.create({
      name: display_name,
      category: specific_category,
      description: description
    })

    return new Response(JSON.stringify({ description }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}