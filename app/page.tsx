import ChatBot from "./components/common/ChatBot/ChatBot";
import MainContent from "./components/domain/home/MainContent";
export default function Home() {
  return <div className="flex flex-col items-center justify-center">
    <MainContent />
    <ChatBot />
  </div>;
}
