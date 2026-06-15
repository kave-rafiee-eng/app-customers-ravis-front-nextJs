import {
  DescriptionType,
  MiniDescriptionType,
} from "@/app/menu/type/menu_type";

export enum ErrorOriginEnum {
  ONLY_ADVANCE = "ONLY_ADVANCE",
  ONLY_TERSE = "ONLY_TERSE",
  ADVANCE_TERSE = "ADVANCE_TERSE",
}

export type errorCodeType = {
  code: string;
  origin: ErrorOriginEnum;
  name: string;
  description: DescriptionType | null;
  solution: DescriptionType | null;
  additional_description_for_ai_assistant: MiniDescriptionType | null;
};
