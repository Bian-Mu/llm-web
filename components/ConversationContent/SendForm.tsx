"use client"

import useConversationStore from "@/store/conversations"
import { useRef, useState } from "react"
import { answerStandard } from '../../lib/answerStandard';


const SendForm: React.FC = () => {

    const { setLoading, addMessage, activeConversationId, setConversationTitle, conversations } = useConversationStore()
    const [file, setFile] = useState<string | null>(null)

    const questionRef = useRef<HTMLTextAreaElement>(null)

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/handle", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("上传失败");
            }
            const data = await res.json();
            setFile(data.text)
            // console.log(data.text)
        } catch (error) {
            console.log("文件有误", error)
        }
    }

    const handleSend = async (event: React.FormEvent) => {
        event.preventDefault()
        if (questionRef.current?.value) {
            const questionContent = questionRef.current?.value
            const sendContent = file ? `${file}，根据以上材料，回答我接下来的问题：${questionContent}` : `回答以下问题：${questionContent}`

            questionRef.current.value = ''
            setFile(null)

            addMessage(activeConversationId as string, "user", questionContent)

            setLoading(true)

            const res = await fetch("/api/send", {
                method: "POST",
                body: sendContent
            })

            const answer = await res.json()
            setLoading(false)

            if (conversations.find(conv => conv.id === activeConversationId)?.title === "新对话") {
                setConversationTitle(activeConversationId as string, answerStandard(answer.content))
            }

            addMessage(activeConversationId as string, "bot", answerStandard(answer.content))

        }
    }


    return (
        <>
            <form onSubmit={handleSend} className="flex flex-row justify-self-center mt-4 min-h-1/9  border-[0.3vh] border-background my-3 w-4/5">
                <textarea ref={questionRef} placeholder="对话框" className="px-2 py-1 basis-9/10">
                </textarea>
                <div className="flex flex-col justify-center basis-1/10 gap-1">
                    <label className={(file ? " cursor-not-allowed " : " cursor-pointer ") + `mx-2 border-[0.3vh] font-bold bg-foreground text-background text-center`} >
                        {file ? "已上传" : "上传"}
                        <input disabled={!!file} type="file" accept=".docx,.txt" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <button type="submit" className="mx-2 border-[0.3vh] font-bold bg-foreground text-background cursor-pointer">
                        发送
                    </button>
                </div>
            </form>
        </>
    )
}


export default SendForm

