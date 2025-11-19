import { NextResponse } from "next/server";
// --- 新增：导入 ChromaClient ---
import { ChromaClient } from "chromadb";
import { getEmbedding } from "../../embedding-utils/route"; // 从共享文件中导入

// --- 环境变量 ---
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const corsHeaders = {
    "Access-Control-Allow-Origin": CORS_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// --- 初始化 Chroma 客户端 ---
const client = new ChromaClient({ path: CHROMA_URL });

export async function OPTIONS() {
    return NextResponse.json(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) ?? {};
        const {
            collection: collectionName = "default", // 重命名以避免与变量 collection 冲突
            documents,
            metadatas,
            ids,
        } = body;

        if (!Array.isArray(documents) || documents.length === 0) {
            return NextResponse.json({ error: "Missing `documents` array." }, { status: 400, headers: corsHeaders });
        }

        console.log(`[Chroma Add] Received ${documents.length} documents for collection '${collectionName}'.`);

        // 1. 获取 Embedding
        const embeddings = await Promise.all(documents.map(doc => getEmbedding(doc, "para")));
        console.log(`[Chroma Add] Successfully generated ${embeddings.length} embeddings.`);

        // 2. 获取或创建集合
        const collection = await client.getOrCreateCollection({ name: collectionName });
        console.log(`[Chroma Add] Got or created collection '${collectionName}'.`);

        // 3. 使用客户端添加文档 (这是关键改动)
        await collection.add({
            ids: ids,
            embeddings: embeddings,
            metadatas: metadatas,
            documents: documents,
        });
        console.log(`[Chroma Add] Successfully added ${documents.length} documents.`);

        return NextResponse.json({ ok: true, collection: collectionName, added: documents.length }, { headers: corsHeaders });

    } catch (err: any) {
        console.error("--- FATAL ERROR in /api/chroma/add ---");
        console.error(err);
        console.error("--------------------------------------");

        return NextResponse.json(
            { error: "An unexpected server error occurred.", message: err.message || String(err) },
            { status: 500, headers: corsHeaders }
        );
    }
}