import { NextRequest, NextResponse } from "next/server";
import * as Ably from "ably";
export type Message = {
  username: string;
  date: Date;
  text: string;
  // Adding a type will let us display notifications from the server about
  // connections and such differently than regular messages from users
  type: "message" | "notification";
};

export async function POST(req: NextRequest) {
  const { username, message } = await req.json();
  if (req.method === "POST" && typeof username && typeof message === "string") {
    try {
      await broadcastMessage({ username: username, text: message });
      return NextResponse.json({stat: `Message sent: ${username}: ${message}` },{ status:200});
    } catch (error) {
      return NextResponse.json({ error }, {status:500});
    }
  } else {
    return NextResponse.json({ error: "Bad request" },{status:400});
  }
}

type BroadcastOptions = Partial<Message> & {
  date?: Date;
  type?: "message" | "notification";
};

const broadcastMessage = async (message: BroadcastOptions) => {
  const defaultOptions = {
    date: new Date(),
    type: "message",
  };

  message = Object.assign({}, defaultOptions, message);

  const ably = new Ably.Realtime.Promise(process.env.ABLY_API_KEY!);

  await ably.connection.once("connected");

  const channel = ably.channels.get("chat");

  // Note: Ably gives you the ability to specify different kinds of events, so a
  // channel can have all sorts of information traveling across it,
  // differentiated by key name. Here, we've just named the ones we're concerned
  // about "message". It could be anything.
  channel.publish("message", message);
};
