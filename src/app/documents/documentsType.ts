import { DescriptionType } from "../tree/type/menu-type";

export type pdfFileType = {
  name: DescriptionType;
  fileName: String;
};
export type GroupDocType = {
  id: string;
  category: DescriptionType;
  files: pdfFileType[] | null;
};

export type CreateGroupDocType = {
  category: DescriptionType;
  files: pdfFileType[] | null;
};
