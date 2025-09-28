"use client";

import { useEffect, useRef, useState } from "react"
import AddConversationButton from "./ConversationList/AddConversationButton"
import ConversationList from "./ConversationList/ConversationList"


const SideBar: React.FC = () => {

    const [isOpen, setIsOpen] = useState<boolean>(true)
    const sidebarRef = useRef<HTMLDivElement>(null);

    const onClick = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                window.innerWidth < 768 // 只在移动端生效
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        isOpen ? (<div ref={sidebarRef} id="past-cv" className="fixed top-28 left-12 w-3/4 h-80 md:h-auto z-50 bg-background md:relative md:inset-auto md:z-auto rounded-md border-[0.3vh] border-foreground basis-1/5 py-3 px-5">
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <span className="rounded-md text-center basis-8/14 text-xl font-bold bg-foreground text-background ">
                        过去对话
                    </span >
                    <div className="basis-4/14"></div>
                    <span className="text-center rounded-xl basis-1/14 text-xl font-bold bg-foreground text-background ">
                        <AddConversationButton />

                    </span>
                    <div className="basis-1/14"></div>
                    <button onClick={onClick} className="text-center rounded-xl basis-1/14 text-xl font-bold bg-foreground text-background">
                        {`<<`}
                    </button>
                </div>
                <hr className="my-2 w-full" />
            </div>

            <div id="past-cv-list" className="mt-1 py-1 h-11/12 overflow-y-auto" >
                <ConversationList />
            </div>

        </div>) : (
            <div>
                <button onClick={onClick} className="basis-1/5 text-center rounded-xl  text-xl font-bold bg-foreground text-background">
                    {`>>`}
                </button>
            </div>
        )

    )
}

export default SideBar