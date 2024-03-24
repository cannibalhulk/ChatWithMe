"use client"
import { useEffect, useRef } from "react";
import type { Message } from "@/types/Message";
// this external dependency needs to be included in your package.json
// It just lets us format dates more easily than with JavaScript's somewhat
// boroque date formatting methods
import dayjs from "dayjs";

type ChatBoxProps = {
  messages: Message[];
};

function ChatBox({ messages }: ChatBoxProps & React.HTMLProps<HTMLDivElement>) {
  // create a ref to the messages container
  const messagesContainer = useRef<HTMLDivElement>(null);

  // Keep the chat scrolled to the bottom whenever there is an incoming message
  useEffect(() => {
    const messagesContainerRef = messagesContainer.current as HTMLDivElement;
    if (messagesContainerRef) {
      messagesContainerRef.scrollTop = messagesContainerRef.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messagesContainer}
      className="bg-transparent w-full px-3 py-4 flex flex-col"
    >
      {messages.map(({ username, date, text, type }, i) => (
        <div key={i} className=" flex justify-start w-full p-3 ">
          <div className="mr-[8px]">
            <span className="mr-[8px] font-thin italic text-stone light:text-white/50 text-[10px]">
              {dayjs(date).format("hh:mm:ss")}
            </span>
            <span className="underline-offset-1 underline">{username}:</span>
          </div>
          {/* Text */}
          <div className="w-auto rounded-md dark:bg-[#282727] light:bg-gradient-to-br from-neutral-400 via-white to-slate-400">
            {text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatBox;
