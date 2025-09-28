"use client"
import { create } from "zustand"

interface Message {
    id: string,
    text: string,
    sender: "user" | "bot",
    timeStamp: Date
}

export interface Conversation {
    id: string,
    title: string,
    messages: Message[],
    createdTime: Date
}

interface ConversationStore {
    loading: boolean,
    setLoading: (isLoad: boolean) => void,
    conversations: Conversation[]
    activeConversationId: Conversation["id"] | null
    setActiveConversation: (id: Conversation["id"]) => void
    setConversationTitle: (id: Conversation["id"], title: Conversation["title"]) => void
    addConversation: (title: Conversation["title"]) => void
    addMessage: (id: Conversation["id"], sender: Message["sender"], text: Message["text"]) => void
    model: string,
    setModel: (model: string) => void
}



const useConversationStore = create<ConversationStore>((set) => ({
    loading: false,
    setLoading: (isLoad: boolean) => set({ loading: isLoad }),
    conversations: [
        {
            id: '1',
            title: '工作讨论',
            messages: [
                { id: '1-1', text: '你好，项目进展如何？', sender: 'user', timeStamp: new Date() },
                { id: '1-2', text: '一切顺利，已经完成了80%', sender: 'bot', timeStamp: new Date() }
            ],
            createdTime: new Date(),
        },
        {
            id: '2',
            title: '旅行计划',
            messages: [
                { id: '2-1', text: '我们应该去哪里旅行？', sender: 'user', timeStamp: new Date() },
                { id: '2-2', text: '我推荐去海边度假', sender: 'bot', timeStamp: new Date() },
            ],
            createdTime: new Date(),
        },
        {
            id: '8',
            title: '学习计划',
            messages: [
                { id: '3-1', text: '今天要学习什么？', sender: 'user', timeStamp: new Date() },
                { id: '3-2', text: '建议学习React和TypeScript', sender: 'bot', timeStamp: new Date() },
            ],
            createdTime: new Date(),
        }

    ],
    activeConversationId: '',
    setActiveConversation: (id: Conversation["id"]) => set({ activeConversationId: id }),
    setConversationTitle: (id: Conversation["id"], title: Conversation["title"]) =>
        set((state) => ({
            conversations: state.conversations.map((conv) =>
                conv.id === id ? {
                    ...conv,
                    title: title
                } : conv
            )
        })),
    addConversation: (title: Conversation["title"]) =>
        set((state) => {
            const newConversation: Conversation = {
                id: Date.now().toString(),
                title,
                messages: [],
                createdTime: new Date(),
            };
            return {
                conversations: [...state.conversations, newConversation],
                activeConversationId: newConversation.id,
            };
        }),
    addMessage: (id: Conversation["id"], sender: Message["sender"], text: Message["text"]) =>
        set((state) => ({
            conversations: state.conversations.map((conv) =>
                conv.id === id ? {
                    ...conv,
                    messages: [
                        ...conv.messages,
                        {
                            id: `${id}-${conv.messages.length + 1}`,
                            text,
                            sender,
                            timeStamp: new Date(),
                        }
                    ]
                } : conv
            )
        })),
    model: "default",
    setModel: (model: string) => set({ model: model })
}));

export default useConversationStore