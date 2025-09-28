"use client";
import useConversationStore from "@/store/conversations"

const basicCss = " border-3 rounded-xl p-2 size-fit "

const ConversationContent: React.FC = () => {
    const { loading, conversations, activeConversationId } = useConversationStore()
    const activeConversation = conversations.find((conv) => conv.id === activeConversationId)
    return (
        <>
            <div className="font-bold text-2xl">{activeConversation?.title.substring(0, 15)}</div>
            <hr />
            <div className="flex flex-col gap-4 mr-1 md:mr-2 my-2">
                {activeConversation?.messages.map((message) => (
                    <ul key={message.id} className={message.sender === "bot" ? basicCss + "bg-background text-foreground" : basicCss + "self-end"} >
                        {message.text}
                    </ul>
                ))}
                {loading ? <div className={basicCss + " bg-background text-foreground"}>正在加载...</div> : ""}
            </div>

        </>
    )
}

export default ConversationContent