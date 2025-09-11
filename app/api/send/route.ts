import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const question = await req.text()

    try {
        const res = await fetch("https://spark-api-open.xf-yun.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer QodIEqtHYrTGWUBhrTEc:dTnOVYscIXfYWVskMbDR",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "lite",
                messages: [
                    {
                        role: "user",
                        content: question
                    }
                ],
                stream: false
            })
        })

        const object = await res.json()
        const content = object["choices"][0]["message"]["content"]
        return NextResponse.json({ content })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err })
    }


}