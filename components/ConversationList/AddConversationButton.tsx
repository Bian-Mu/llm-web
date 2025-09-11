"use client";

import useConversationStore from "@/store/conversations";

const AddConversationButton: React.FC = () => {
    const { addConversation, conversations } = useConversationStore()

    const sortedConversations = [...conversations].sort((a, b) => Number(b.id) - Number(a.id))
    function onClick() {
        if (sortedConversations.length === 0 || sortedConversations[0]?.title !== "新对话") addConversation("新对话")
    }

    return (
        <button id="new-cv-button cursor-pointer" onClick={onClick}>
            +
        </button>
    )
}

export default AddConversationButton