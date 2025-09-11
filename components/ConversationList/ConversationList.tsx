"use client";
import { useEffect } from 'react';
import useConversationStore from '../../store/conversations';


const ConversationList: React.FC = () => {

    const { conversations, activeConversationId, setActiveConversation } = useConversationStore()

    useEffect(() => {
        if (conversations.length > 0 && !activeConversationId) {
            const maxIdConversation = conversations.reduce((max, conv) =>
                Number(conv.id) > Number(max.id) ? conv : max
            );
            setActiveConversation(maxIdConversation.id);
        }
    });

    const sortedConversations = [...conversations].sort((a, b) => Number(b.id) - Number(a.id))
    return (
        <>
            {sortedConversations.map((conv) => (
                <ul key={conv.id} className={conv.id === activeConversationId ? "inline-block m-1 px-2  font-bold bg-foreground text-background cursor-pointer" : "m-1 mx-3 cursor-pointer"} onClick={() => setActiveConversation(conv.id)}>
                    <span>
                        {conv.title.length <= 10 ? conv.title : conv.title.slice(0, 10) + ". . ."}
                    </span>
                </ul>
            ))}
        </>
    )
}

export default ConversationList