import { DescriptionType } from "@/app/menu/type/menu_type";

export type pdfFileType = {
  name: DescriptionType;
  fileName: string;
};
export type GroupDocType = {
  id: string;
  category: DescriptionType;
  files: pdfFileType[];
};

export type CreateGroupDocType = {
  category: DescriptionType;
  files: pdfFileType[];
};
