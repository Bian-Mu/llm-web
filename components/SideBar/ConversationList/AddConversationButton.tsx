"use client";

import useConversationStore from "@/store/conversations";
import { PlusOutlined } from '@ant-design/icons'

const AddConversationButton: React.FC = () => {
    const { addConversation, conversations } = useConversationStore()

    const sortedConversations = [...conversations].sort((a, b) => Number(b.id) - Number(a.id))
    function onClick() {
        if (sortedConversations.length === 0 || sortedConversations[0]?.title !== "新对话") addConversation("新对话")
    }

    return (
        <button id="new-cv-button" className="cursor-pointer" onClick={onClick}>
            <PlusOutlined />
        </button>
    )
}

export default AddConversationButton