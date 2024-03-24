import { NextRequest, NextResponse } from "next/server";
import * as Ably from "ably";
import {} from "ably/react"
import type { Message } from "@/types/Message";

export async function POST(req: NextRequest) {
  const { username, message, channel } = await req.json();
  if (req.method === "POST" && typeof username && typeof message === "string") {
    try {
      await broadcastMessage({ username: username, text: message }, channel);
      return NextResponse.json({stat: `Message sent by ${username}: ${message}` },{ status:200});
    } catch (error) {
      return NextResponse.json({ error }, {status:500});
    }
  } else {
    return NextResponse.json({ error: "Bad request" },{status:400});
  }
}

type BroadcastOptions = {
  username: string;
  text: string;
  date?: Date;
  type?: "message" | "notification";
};

const broadcastMessage = async ({ username, text, date = new Date(), type = "message" }:
BroadcastOptions, chnl_name:string) => {

  const messageObject:Message = {
    username,
    date,
    text,
    type
  }

  const ably = new Ably.Realtime.Promise(process.env.ABLY_API_KEY!);

  await ably.connection.once("connected");

  const channel = ably.channels.get(chnl_name);

  // Note: Ably gives you the ability to specify different kinds of events, so a
  // channel can have all sorts of information traveling across it,
  // differentiated by key name. Here, we've just named the ones we're concerned
  // about "message". It could be anything.
  await channel.publish({});
};
