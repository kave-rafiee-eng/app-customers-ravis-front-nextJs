export type MessageType = {
  type: "ai" | "human";
  data: string;
  time?: number;
};
