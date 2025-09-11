import mammoth from "mammoth";
// import pdfParse from "pdf-parse";


export async function handleFile(
    buffer: ArrayBuffer,
    mimeType: string,
    fileName?: string
): Promise<string> {
    if (mimeType === "text/plain") {
        return new TextDecoder("utf-8").decode(buffer);
    }

    if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        (fileName && fileName.endsWith(".docx"))
    ) {
        const nodeBuffer = Buffer.from(buffer);
        const { value } = await mammoth.extractRawText({ buffer: nodeBuffer });
        return value.trim();
    }

    throw new Error("不支持的文件类型");
}


