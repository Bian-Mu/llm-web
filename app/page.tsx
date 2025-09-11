import ConversationContent from "@/components/ConversationContent/ConversationContent"
import SendForm from "@/components/ConversationContent/SendForm"
import AddConversationButton from "@/components/ConversationList/AddConversationButton"
import ConversationList from "@/components/ConversationList/ConversationList"

const Home: React.FC = () => {
  return (
    <div id="full-page" className="h-9/10 mt-7 flex flex-row gap-7 mx-7">
      <div id="past-cv" className="relative rounded-md border-[0.3vh] border-foreground basis-1/5 py-3 px-5">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <span className="rounded-md text-center basis-8/14 text-xl font-bold bg-foreground text-background ">
              过去对话
            </span >
            <div className="basis-6/14"></div>
            <span className="text-center rounded-4xl basis-1/14 text-xl font-bold bg-foreground text-background ">
              <AddConversationButton />
            </span>
          </div>
          <hr className="my-2 w-full" />
        </div>

        <div id="past-cv-list" className="mt-1 py-1 h-11/12 overflow-y-auto" >
          <ConversationList />
        </div>

      </div>
      <div id="now-cv" className="overflow-hidden rounded-sm basis-4/5 pt-6 pl-8 min-w-1/2 bg-foreground text-background max-h-full">
        <div className="h-10/12 overflow-y-auto">
          <div id="now-cv-turns">
            <ConversationContent />
          </div>
        </div>
        <SendForm />
      </div>
    </div >

  )
}

export default Home