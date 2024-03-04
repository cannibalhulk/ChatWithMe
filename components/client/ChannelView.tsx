"use client";
import React, { useEffect, useState, useCallback } from "react";
import * as Ably from "ably";
import type { Message } from "@/types/Message";
import { TChannel } from "./ChannelsView";
import { useSession } from "next-auth/react";
import { MessagesSquare, Share2, Send } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import { useSelectedLayoutSegments } from "next/navigation";
import {
  FacebookIcon,
  TelegramShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import ChatInput from "./ChatInput";
import ChatBox from "./ChatBox";

interface PageProps {
  id: string;
}

function ChannelView({ params }: { params: PageProps }) {
  const { data: session } = useSession();
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [channelinfo, setChannelInfo] = useState<TChannel | null>(null);

  /**
   * Only Ably
   */
  const [channel, setChannel] =
    useState<Ably.Types.RealtimeChannelPromise | null>(null);

  const [messages, setMessages] = useState([] as Array<Message>);
  const user = session?.user?.name?.split(" ");
  let username = "";
  if (user) {
    username = user?.length > 1 ? [user[0]].join("") : user?.join("");
  }

  const addMessage = (message: Message) => {
    setMessages((prevMessages) =>
      [...prevMessages, message]
        // limit the history length by only ever keeping the most recent 50
        // messages, at most
        .splice(-50)
    );
  };

  const sendMessage = useCallback(
    async (text: string) => {
      await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          message: text,
          channel: channelinfo?.chnl_name,
        }),
      });
    },
    [username, channelinfo]
  );

  const { id } = params;
  useEffect(() => {
    const getChannel = async () => {
      /**
       * no need to include 'NEXTAUTH_URL` env variable here as it is already a client component
       */
      const res = await fetch(`/api/channels?id=${id}`, { cache: "no-cache" });
      const data: TChannel = await res.json();
      setChannelInfo(data);
      console.log(data);
    };

    getChannel();
  }, [id]);

  useEffect(() => {
    let ablyClient: Ably.Types.RealtimePromise;
    const init = async () => {
      ablyClient = new Ably.Realtime.Promise({
        authUrl: "/api/token",
      });

      await ablyClient.connection.once("connected");

      addMessage({
        username: "Server",
        text: "Connected to chat! ⚡️",
        type: "notification",
        date: new Date(),
      });

      const chatChannel = ablyClient.channels.get(channelinfo?.chnl_name!);
      setChannel(chatChannel);
      // Incoming messages
      // We'll be listening for "message", which is the string we chose in
      // `api/message/route.ts`, but just as a reminder, it could be anything.
      await chatChannel.subscribe("message", (message: Ably.Types.Message) => {
        addMessage(message.data as Message);
      });
    };
    init();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
      if (ablyClient) {
        ablyClient.close();
      }
    };
  }, []);

  useEffect(() => {
    if (username && channel) {
      // This is when we tell Ably our username
      channel.presence.enter({ username });
      window.addEventListener("beforeunload", () => channel.presence.leave());
    }

    return () => {
      window.removeEventListener(
        "beforeunload",
        () => channel && channel.presence.leave()
      );
    };
  }, [username, channel]);

  return (
    <div className="w-full flex flex-col min-h-screen pb-2">
      <div className="px-4 py-4 flex justify-between sticky backdrop-blur-md bg-gradient-to-b rounded-br-medium rounded-bl-medium  dark:from-black/80 from-white to-white/40 dark:to-white/30 w-full">
        <div className="flex flex-col">
          <div className="inline-flex text-center">
            <div className="p-2 dark:bg-gray-800 rounded-full">
              <MessagesSquare />
            </div>
            <h1 className="ml-3 text-xl">{channelinfo?.chnl_name}</h1>
          </div>
          <div className="opacity-70 text-base ml-10 line-clamp-1">
            {channelinfo?.chnl_desc}
          </div>
        </div>
        <div>
          {/* A Social Share - Modal Component */}
          <Button isIconOnly radius="full" onPress={onOpen}>
            <Share2 size={20} />
          </Button>
          <Modal
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            radius="lg"
            classNames={{
              body: "py-6 px-2",
              backdrop: "bg-[#292f46]/60 backdrop-opacity-80",
              base: "border-[#292f46] border-2 bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
              header: "border-b-[1px] border-[#292f46]",
              footer: "border-t-[1px] border-[#292f46]",
              closeButton: "hover:bg-white/5 active:bg-white/10 bg-white/10",
            }}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Share it with your friends!</ModalHeader>
                  <ModalBody className="flex flex-row justify-around">
                    <FacebookShareButton
                      hashtag="#chatapp #chatwme #trend #socialapp #follow"
                      url={location.href}
                    >
                      <FacebookIcon size={50} round={true} />
                    </FacebookShareButton>
                    <WhatsappShareButton title={channelinfo?.chnl_name + "| ChatWithMe | Chat With Strangers!"}  url={location.href}>
                      <WhatsappIcon size={50} round={true} />
                    </WhatsappShareButton>
                    <TwitterShareButton
                      hashtags={[
                        "chatpp",
                        "chatwme",
                        "trend",
                        "socialapp",
                        "follow",
                        `${channelinfo?.category}`,
                      ]}
                      url={location.href}
                    >
                      <TwitterIcon size={50} round={true} />
                    </TwitterShareButton>
                    <LinkedinShareButton
                      summary={channelinfo?.chnl_desc}
                      url={location.href}
                    >
                      <LinkedinIcon round={true} size={50} />
                    </LinkedinShareButton>
                    <TelegramShareButton
                      url={location.href}
                      title={channelinfo?.chnl_name}
                    >
                      <TelegramIcon size={50} round={true} />
                    </TelegramShareButton>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
      {/* Chat Messages */}
      <ChatBox messages={messages} />
      <div className="fixed w-[80%] bottom-0 left-[10%] right-[10%] flex justify-self-end items-end">
        <ChatInput submit={sendMessage} />
      </div>
    </div>
  );
}

export default ChannelView;
