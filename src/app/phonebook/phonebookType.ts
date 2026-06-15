import { DescriptionType } from "@/app/menu/type/menu_type";

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
