export enum TicketStatusEnum {
  pending = "pending",
  closed = "closed",
}

export type TicketType = {
  id: string;
  userid: string;
  question: string;
  answer: string;
  status: TicketStatusEnum;
};
