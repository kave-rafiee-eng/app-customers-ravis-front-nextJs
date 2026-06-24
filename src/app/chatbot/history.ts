import { MessageType } from "./message-type";

export type LangChainHistoryMessage = {
  type: "human" | "ai";
  content: string;
};

export function createHistory(msgs: MessageType[]): LangChainHistoryMessage[] {
  return msgs.map((msg) => ({
    type: msg.type,
    content: msg.data,
  }));
}
