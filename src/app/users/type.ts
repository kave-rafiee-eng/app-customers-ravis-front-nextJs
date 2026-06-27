export type MessageHistoryType = {
  aiModel: string;
  userMsg: string;
  aiResponse: string;
};

export type MessageAiHistoryType = {
  id: string;

  message: MessageHistoryType;

  createdAt: Date;
};

export type UserInfoType = {
  job?: string;
};

export enum TicketStatusEnum {
  pending = "pending",
  closed = "closed",
}
export type TicketType = {
  id: string;

  user: userType;

  question: string;

  answer: string;

  status: TicketStatusEnum;

  createdAt: Date;

  closedAt: Date;
};

export type userType = {
  id: string;

  name: string;

  phone: string;

  email: string;

  info: UserInfoType;

  agentMemory: string;

  tickets: TicketType[];

  messageAiHistories: MessageAiHistoryType[];
};
