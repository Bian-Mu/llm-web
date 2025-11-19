import crypto from "crypto";

// --- 讯飞 Embedding API 的环境变量 ---
// 确保这些变量在你的 .env.local 文件中已正确设置
const EMBEDDING_API_URL = "https://emb-cn-huabei-1.xf-yun.com/";
const EMBEDDING_APPID = process.env.EMBEDDING_APPID;
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY;
const EMBEDDING_API_SECRET = process.env.EMBEDDING_API_SECRET;

/**
 * 讯飞 API 鉴权函数
 * 根据请求参数生成一个带鉴权的 URL
 * @param requestUrl - 原始请求 URL
 * @param method - HTTP 方法, 默认为 "POST"
 * @param apiKey - 你的 API Key
 * @param apiSecret - 你的 API Secret
 * @returns 带有鉴权参数的完整 URL 字符串
 */
function assembleWsAuthUrl(
    requestUrl: string,
    method = "POST",
    apiKey: string,
    apiSecret: string
): string {
    const url = new URL(requestUrl);
    const host = url.host;
    const path = url.pathname;
    const date = new Date().toUTCString();

    const signatureOrigin = `host: ${host}\ndate: ${date}\n${method} ${path} HTTP/1.1`;

    const signatureSha = crypto
        .createHmac("sha256", apiSecret)
        .update(signatureOrigin)
        .digest("base64");

    const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;

    const authorization = Buffer.from(authorizationOrigin).toString("base64");

    const params = new URLSearchParams({
        host: host,
        date: date,
        authorization: authorization,
    });

    return `${requestUrl}?${params.toString()}`;
}

/**
 * 调用讯飞星火 API 获取文本的 embedding 向量
 * @param text - 需要进行向量化的文本
 * @param domain - 使用的领域模型, 'para' 用于知识库文档, 'query' 用于用户查询
 * @returns 返回一个包含浮点数的向量数组
 */
export async function getEmbedding(
    text: string,
    domain: 'para' | 'query' // 使用联合类型确保传入正确的 domain
): Promise<number[]> {

    // 1. 检查 API 凭证是否存在
    if (!EMBEDDING_APPID || !EMBEDDING_API_KEY || !EMBEDDING_API_SECRET) {
        throw new Error("Missing Embedding API credentials in environment variables.");
    }

    // 2. 生成鉴权 URL
    const authUrl = assembleWsAuthUrl(EMBEDDING_API_URL, "POST", EMBEDDING_API_KEY, EMBEDDING_API_SECRET);

    // 3. 构造请求体
    const textToEmbed = {
        messages: [{ content: text, role: "user" }],
    };

    const body = {
        header: {
            app_id: EMBEDDING_APPID,
            // 确保 status 字段存在
            status: 3,
            uid: `user-${domain}`, // 可以提供一个简单的用户ID
        },
        parameter: {
            emb: {
                // 动态使用传入的 domain
                domain: domain,
                feature: {
                    encoding: "utf8",
                },
            },
        },
        payload: {
            messages: {
                text: Buffer.from(JSON.stringify(textToEmbed)).toString("base64"),
            },
        },
    };

    // 4. 发起网络请求
    const response = await fetch(authUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Embedding API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // 5. 检查和解析返回结果
    if (data?.header?.code !== 0) {
        console.error("Embedding API Error:", data);
        throw new Error(`Embedding API failed with code ${data?.header?.code}: ${data?.header?.message}`);
    }

    const base64Embedding = data.payload.feature.text;
    const buffer = Buffer.from(base64Embedding, "base64");

    // 将 Buffer 解码为 Float32 数组
    const float32Array = new Float32Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength / 4
    );

    return Array.from(float32Array);
}