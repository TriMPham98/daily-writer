import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const entry = await prisma.writingEntry.update({
      where: {
        id: params.id,
      },
      data: {
        content: body.content,
        wordCount: body.wordCount,
        isCompleted: body.isCompleted,
        lastModified: new Date(),
      },
    });
    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}
