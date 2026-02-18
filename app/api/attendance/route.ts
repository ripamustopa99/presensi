import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "db.json");

// Fungsi untuk membaca file
export async function GET() {
  try {
    const jsonData = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(jsonData));
  } catch (error) {
    return NextResponse.json({ sessions: [] });
  }
}

// Fungsi untuk menulis/update file
export async function POST(request: Request) {
  try {
    const newData = await request.json();
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
