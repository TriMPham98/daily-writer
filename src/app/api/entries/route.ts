import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry = await prisma.writingEntry.create({
      data: {
        content: body.content,
        date: body.date,
        wordCount: body.wordCount,
        targetWordCount: body.targetWordCount,
        isCompleted: body.isCompleted,
      },
    });
    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const entries = await prisma.writingEntry.findMany({
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
