"use client"
import { ReactHTMLElement, useCallback, useState } from "react";
import { Textarea, Button } from "@nextui-org/react";
import { Send } from "lucide-react";

type ChatInputProps = {
  submit: (text: string) => void;
};
function ChatInput({
  submit,
  className = "",
  ...rest
}: ChatInputProps & React.HTMLProps<HTMLDivElement>) {
  const [text, setText] = useState("");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && text.length > 0) {
      sendMessage(text);
    }
  };

  const sendMessage = useCallback(
    (text: string) => {
      submit(text);
      setText("");
    },
    [submit]
  );
  return (
    <div
      {...rest}
      className="w-full bg-stone-300 dark:bg-[#1b1b1b] rounded-xl rounded-b-none p-1 pb-0 flex flex-row justify-between  relative"
    >
      <Textarea
        className="relative"
        autoFocus={true}
        variant="faded"
        placeholder="Your words here..."
        classNames={{
          input: "lg:text-md font-bold tracking-wide",
          inputWrapper: "light:border-2 light:border-stone-600",
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        }
        value={text}
        onKeyDown={handleKeyDown}
        maxRows={5}
      />
      <Button
        isDisabled={!text}
        isIconOnly
        onClick={()=>sendMessage(text)}
        className="ml-2 h-20 relative"
        variant="faded"
        aria-label="send-messages"
      >
        <Send />
      </Button>
    </div>
  );
}

export default ChatInput;
