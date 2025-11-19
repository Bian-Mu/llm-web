import { NextResponse } from "next/server";
// --- 新增：导入 ChromaClient ---
import { ChromaClient } from "chromadb";
import { getEmbedding } from "../../embedding-utils/route"; // 从共享文件中导入

// --- 环境变量 和 CORS 头 ---
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
        const { collection: collectionName = "default", query, n_results = 5 } = body;

        if (!query || typeof query !== 'string') {
            return NextResponse.json({ error: "Missing `query` string." }, { status: 400, headers: corsHeaders });
        }

        console.log(`[Chroma Search] Received query for collection '${collectionName}'.`);

        // 1. 将用户的查询文本向量化
        const queryEmbedding = await getEmbedding(query, "query");
        console.log(`[Chroma Search] Successfully generated query embedding.`);

        // 2. 获取集合
        // 注意：这里我们假设集合已存在。如果不存在，客户端会抛出错误。
        const collection = await client.getCollection({ name: collectionName });
        console.log(`[Chroma Search] Got collection '${collectionName}'.`);

        // 3. 使用客户端进行查询 (这是关键改动)
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: n_results,
        });
        console.log(`[Chroma Search] Query completed successfully.`);

        return NextResponse.json({ ok: true, collection: collectionName, results: results }, { headers: corsHeaders });

    } catch (err: any) {
        console.error("--- FATAL ERROR in /api/chroma/search ---");
        console.error(err);
        console.error("-----------------------------------------");

        return NextResponse.json(
            { error: "Server error during search.", message: err.message || String(err) },
            { status: 500, headers: corsHeaders }
        );
    }
}