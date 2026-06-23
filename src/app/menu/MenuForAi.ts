import {
  menuType,
  optionType,
  settingMultyGroupType,
  settingOneParameterType,
  settingOneSelectType,
  typeMenuEnum,
} from "./type/menu_type";
import { checkTypeMenu } from "./type/checkTypeMenu";

type OptionAi = {
  value: string;
  description: string;
};

export enum MenuTypeAi {
  SETTING_ON_PARAMETER = "single setting with an integer input value",

  SETTING_ON_SELECT = "single setting where the user selects one option from a predefined list",

  SETTING_MULTI_SELECT = "collection of settings where each setting has a label and selects one option from the same shared option list",

  SETTING_MULTI_GROUP = "array of setting groups. Each group may contain integer input settings and single-option selection settings. The user first selects a group item and then edits the settings within that group",
}

interface MenuAiBaseModel {
  id: string;
  label: string;
  type: MenuTypeAi;
  navigationToMenu: string[];
  description: string;
  description_for_ai: string;
}

interface MenuSettingOneParameterAi extends MenuAiBaseModel {
  unit: string;
  minValue: number;
  maxValue: number;
}

interface MenuSettingOneSelectAi extends MenuAiBaseModel {
  options: OptionAi[];
}

interface MenuSettingMultySelectAi extends MenuAiBaseModel {
  options: OptionAi[];
  itemLabels: OptionAi[];
}

interface itemOneParameterAi {
  type: MenuTypeAi;
  label: string;
  description: string;
  description_for_ai: string;
  unit: string;
  minValue: number;
  maxValue: number;
}

interface itemOneSelectAi {
  type: MenuTypeAi;
  label: string;
  description: string;
  description_for_ai: string;
  options: OptionAi[];
}

interface MenuSettingMultyGroupAi extends MenuAiBaseModel {
  settings: (itemOneSelectAi | itemOneParameterAi)[];
}

type MenuAi =
  | MenuSettingOneParameterAi
  | MenuSettingOneSelectAi
  | MenuSettingMultySelectAi
  | MenuSettingMultyGroupAi;

function optionForAi(option: optionType): OptionAi {
  return {
    value: option.value,
    description: option.description.english,
  };
}

function mapTypeToMenuTypeAi(type: typeMenuEnum): MenuTypeAi | null {
  switch (type) {
    case typeMenuEnum.SETTING_ON_PARAMETER:
      return MenuTypeAi.SETTING_ON_PARAMETER;
    case typeMenuEnum.SETTING_ON_SELECT:
      return MenuTypeAi.SETTING_ON_SELECT;
    case typeMenuEnum.SETTING_MULTY_SELECT:
      return MenuTypeAi.SETTING_MULTI_SELECT;
    case typeMenuEnum.SETTING_MULTY_GROUP:
      return MenuTypeAi.SETTING_MULTI_GROUP;
    default:
      return null;
  }
}

function itemOneParameterForAi(
  setting: settingOneParameterType,
): itemOneParameterAi {
  return {
    type: MenuTypeAi.SETTING_ON_PARAMETER,
    label: setting.label,
    unit: setting.unit,
    minValue: setting.minValue,
    maxValue: setting.maxValue,
    description: setting.description.english,
    description_for_ai: setting.additional_description_for_ai_assistant.english,
  };
}

function itemOneSelectForAi(setting: settingOneSelectType): itemOneSelectAi {
  return {
    type: MenuTypeAi.SETTING_ON_SELECT,
    label: setting.label,
    description: setting.description.english,
    description_for_ai: setting.additional_description_for_ai_assistant.english,
    options: setting.options.map(optionForAi),
  };
}

function groupItemForAi(
  item: settingMultyGroupType,
): itemOneSelectAi | itemOneParameterAi | null {
  if (item.settingOneParameter) {
    return itemOneParameterForAi(item.settingOneParameter);
  }

  if (item.settingOneSelect) {
    return itemOneSelectForAi(item.settingOneSelect);
  }

  return null;
}

function getGroupAddress(group: settingMultyGroupType[]): string {
  for (const item of group) {
    if (item.settingOneParameter) {
      return String(item.settingOneParameter.address);
    }
    if (item.settingOneSelect) {
      return String(item.settingOneSelect.address);
    }
  }
  return "";
}

function mapMenuToAi(allmenus: menuType[], menu: menuType): MenuAi | null {
  const menuTypeChecked = checkTypeMenu(menu);
  const aiType = mapTypeToMenuTypeAi(menuTypeChecked);
  if (!aiType) return null;

  const base = {
    id: menu.id,
    label: menu.lable ?? "",
    type: aiType,
  };

  switch (menuTypeChecked) {
    case typeMenuEnum.SETTING_ON_PARAMETER: {
      const setting = menu.data.settingOneParameter;
      if (!setting) return null;

      const result: MenuSettingOneParameterAi = {
        ...base,
        navigationToMenu: findAddressMenu(allmenus, menu),
        description: setting.description.english,
        description_for_ai:
          setting.additional_description_for_ai_assistant.english,
        unit: setting.unit,
        minValue: setting.minValue,
        maxValue: setting.maxValue,
      };
      return result;
    }

    case typeMenuEnum.SETTING_ON_SELECT: {
      const setting = menu.data.settingOneSelect;
      if (!setting) return null;

      const result: MenuSettingOneSelectAi = {
        ...base,
        navigationToMenu: findAddressMenu(allmenus, menu),
        description: setting.description.english,
        description_for_ai:
          setting.additional_description_for_ai_assistant.english,
        options: (setting.options ?? []).map(optionForAi),
      };
      return result;
    }

    case typeMenuEnum.SETTING_MULTY_SELECT: {
      const setting = menu.data.settingMultySelect;
      if (!setting) return null;

      const result: MenuSettingMultySelectAi = {
        ...base,
        navigationToMenu: findAddressMenu(allmenus, menu),
        description: setting.description.english,
        description_for_ai:
          setting.additional_description_for_ai_assistant.english,
        options: (setting.options ?? []).map(optionForAi),
        itemLabels: (setting.itemLabels ?? []).map(optionForAi),
      };
      return result;
    }

    case typeMenuEnum.SETTING_MULTY_GROUP: {
      const group = menu.data.settingMultyGroup;
      if (!group?.length) return null;

      const settings = group
        .map(groupItemForAi)
        .filter(
          (item): item is itemOneSelectAi | itemOneParameterAi => item !== null,
        );

      const result: MenuSettingMultyGroupAi = {
        ...base,
        navigationToMenu: findAddressMenu(allmenus, menu),
        description: menu.description.english,
        description_for_ai:
          menu.additional_description_for_ai_assistant.english,
        settings,
      };
      return result;
    }

    default:
      return null;
  }
}

export function menusForAi(allmenus: menuType[]): MenuAi[] {
  return allmenus
    .map((menu) => mapMenuToAi(allmenus, menu))
    .filter((item) => item != null);
}

function findMenuById(id: string, menus: menuType[]): menuType | undefined {
  return menus.find((menu) => menu.id === id);
}

function findAddressMenu(menus: menuType[], targetMenu: menuType): string[] {
  const result: string[][] = [];
  function findPaths(menuId: string, path: string[] = []) {
    const menu = findMenuById(menuId, menus);
    if (!menu) return;
    if (menu.parentId.length == 0) {
      result.push([...path, "main"]);
      return;
    }
    for (const parent of menu.parentId) {
      findPaths(parent.id, [...path, parent.label as string]);
    }
  }

  targetMenu.parentId.forEach((parent) => {
    findPaths(parent.id);
  });
  return result.map((nav) => {
    return nav.reverse().join(">");
  });
}
