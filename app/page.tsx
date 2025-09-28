import ConversationContent from "@/components/ConversationContent/ConversationContent"
import SendForm from "@/components/ConversationContent/SendForm"
import SideBar from "@/components/SideBar/SideBar"

const Home: React.FC = () => {
  return (
    <div id="full-page" className="h-10/11  md:h-9/10 md:mt-7 flex flex-row md:gap-7 md:mx-7">

      <SideBar />

      <div id="now-cv" className="mx-auto overflow-hidden rounded-sm basis-9/10  md:basis-4/5 pt-2 pl-3 pr-3 md:pt-6 md:pl-8 md:pr-8 md:min-w-1/2 bg-foreground text-background max-h-full">
        <div className="h-11/13 md:h-10/12 overflow-y-auto">
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