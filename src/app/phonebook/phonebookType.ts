import { DescriptionType } from "../tree/type/menu-type";

export type PhonebookType = {
  id: string;
  name: string;
  phone: string;
  description: DescriptionType;
};

export type CreatePhonebookType = {
  name: string;
  phone: string;
  description: DescriptionType;
};
