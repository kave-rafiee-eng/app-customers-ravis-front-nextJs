import { errorCodeType } from "./errorType";

type ErrorCodeAi = {
  code: string;
  name: string;
  reason: string;
  solution: string;
  additional_description_for_ai: string;
};

export function errorCodeForAi(errorCode: errorCodeType[]): ErrorCodeAi[] {
  return errorCode.map((error) => ({
    code: error.code,
    name: error.name,
    reason: error.description!.english,
    solution: error.solution!.english,
    additional_description_for_ai:
      error.additional_description_for_ai_assistant!.english,
  }));
}
