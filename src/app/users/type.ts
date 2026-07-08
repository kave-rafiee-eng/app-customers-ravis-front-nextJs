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

export type DeviseInfoType = {
  phone?: string;
};

export type DeviceType = {
  serial: number;
  address: string;
  info: DeviseInfoType;
};
export type userType = {
  id: string;

  phone: string;
  email: string;
  password: string;
  name: string;
  info: UserInfoType;
  agentMemory: string;
  tickets: TicketType[];
  messageAiHistories: MessageAiHistoryType[];
  devices: DeviceType[];
};
