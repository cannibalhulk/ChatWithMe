export type Message = {
    username: string;
    date: Date;
    text: string;
    // Adding a type will let us display notifications from the server about
    // connections and such differently than regular messages from users
    type: "message" | "notification";
  };