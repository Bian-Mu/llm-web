import { NextRequest, NextResponse } from "next/server";
import { handleFile } from "@/lib/handleFile";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "缺少文件" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    try {
        const text = await handleFile(buffer, file.type, file.name);
        return NextResponse.json({ text });
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 });
    }
}
