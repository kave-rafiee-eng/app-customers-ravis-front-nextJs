import { menuType, typeMenuEnum } from "./menu_type";

export function checkTypeMenu(menu: menuType | undefined): typeMenuEnum {
  if (!menu) return typeMenuEnum.UNDEFINDED;

  const { type, data } = menu;
  if (!data) return typeMenuEnum.UNDEFINDED;

  switch (type) {
    case typeMenuEnum.SUBMENU:
      return typeMenuEnum.SUBMENU;

    case typeMenuEnum.SETTING_ON_PARAMETER:
      return data.settingOneParameter
        ? typeMenuEnum.SETTING_ON_PARAMETER
        : typeMenuEnum.UNDEFINDED;

    case typeMenuEnum.SETTING_ON_SELECT:
      return data.settingOneSelect
        ? typeMenuEnum.SETTING_ON_SELECT
        : typeMenuEnum.UNDEFINDED;

    case typeMenuEnum.SETTING_MULTY_SELECT:
      return data.settingMultySelect
        ? typeMenuEnum.SETTING_MULTY_SELECT
        : typeMenuEnum.UNDEFINDED;

    case typeMenuEnum.SETTING_MULTY_GROUP:
      return data.settingMultyGroup
        ? typeMenuEnum.SETTING_MULTY_GROUP
        : typeMenuEnum.UNDEFINDED;

    case typeMenuEnum.UNDEFINDED:
      return typeMenuEnum.UNDEFINDED;

    default:
      return typeMenuEnum.UNDEFINDED;
  }
}
