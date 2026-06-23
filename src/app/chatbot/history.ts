import { MessageType } from "./message-type";

export function createHistory(msgs: MessageType[]): string {
  return msgs.map((msg) => `( ${msg.type} : ${msg.data} )`).join(",");
}
