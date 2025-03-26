import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getResponse(book: string): Promise<string> {
  const book_description =
    "I will be providing a description of a book. \n" +
    "Please generate and format a book summary along with genre tags. \n" +
    "Respond with an announcement that includes: the genre tags, summary, and provide a description of what type of reader would enjoy the book. \n" +
    "----------------------- \n" +
    book;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: book_description },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return content;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { book } = body;

    if (!book) {
      return NextResponse.json(
        { error: "Book description is required" },
        { status: 400 }
      );
    }

    const response = await getResponse(book);
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
