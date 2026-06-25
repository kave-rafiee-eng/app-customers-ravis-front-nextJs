import {
  API_TRANSLATE,
  END_POINT_TRANSLATER_ENGLISH,
  END_POINT_TRANSLATER_FULL,
} from "../constant";
import { DescriptionType, MiniDescriptionType } from "../menu/type/menu_type";

export async function translateFull(persian: string): Promise<DescriptionType> {
  try {
    const resault = await API_TRANSLATE.post(END_POINT_TRANSLATER_FULL, {
      text: persian,
    });
    return resault.data as DescriptionType;
  } catch (err) {
    console.log(err);
    throw new Error("connection Error");
  }
}

export async function translateEnglish(
  persian: string,
): Promise<MiniDescriptionType> {
  try {
    const resault = await API_TRANSLATE.post(END_POINT_TRANSLATER_ENGLISH, {
      text: persian,
    });
    return resault.data as MiniDescriptionType;
  } catch (err) {
    console.log(err);
    throw new Error("connection Error");
  }
}
