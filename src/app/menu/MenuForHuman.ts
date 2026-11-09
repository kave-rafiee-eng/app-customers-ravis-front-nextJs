import {
  menuType,
  optionType,
  settingMultyGroupType,
  settingOneParameterType,
  settingOneSelectType,
  typeMenuEnum,
} from "./type/menu_type";
import { checkTypeMenu } from "./type/checkTypeMenu";

type HumanText = {
  english: string;
  persian: string;
};

type OptionHuman = {
  value: string;
  description: HumanText;
};

export const MenuTypeHuman = {
  SETTING_ON_PARAMETER: {
    english: "single setting with a numeric value",
    persian: "یک تنظیم با مقدار عددی",
  },
  SETTING_ON_SELECT: {
    english: "single setting where one option is selected from a list",
    persian: "یک تنظیم که یک گزینه از فهرست انتخاب می‌شود",
  },
  SETTING_MULTI_SELECT: {
    english:
      "several settings that each select one option from the same shared list",
    persian: "چند تنظیم که هر کدام یک گزینه از یک فهرست مشترک انتخاب می‌کنند",
  },
  SETTING_MULTI_GROUP: {
    english:
      "a group of settings. Each group can contain numeric settings and single-choice settings",
    persian:
      "گروهی از تنظیمات. هر گروه می‌تواند تنظیم عددی و تنظیم انتخاب تکی داشته باشد",
  },
} as const;

type MenuTypeHuman = (typeof MenuTypeHuman)[keyof typeof MenuTypeHuman];

interface MenuHumanBaseModel {
  id: string;
  label: string;
  type: MenuTypeHuman;
  navigationToMenu: string[];
  description: HumanText;
}

interface MenuSettingOneParameterHuman
  extends MenuHumanBaseModel, oneParameterParams {}

interface MenuSettingOneSelectHuman extends MenuHumanBaseModel {
  options: OptionHuman[];
}

interface MenuSettingMultySelectHuman extends MenuHumanBaseModel {
  options: OptionHuman[];
  itemLabels: OptionHuman[];
}

interface oneParameterParams {
  unit: string;
  minValue: number;
  maxValue: number;
  step: number;
}

interface itemOneParameterHuman extends oneParameterParams {
  type: MenuTypeHuman;
  label: string;
  description: HumanText;
}

interface itemOneSelectHuman {
  type: MenuTypeHuman;
  label: string;
  description: HumanText;
  options: OptionHuman[];
}

interface MenuSettingMultyGroupHuman extends MenuHumanBaseModel {
  settings: (itemOneSelectHuman | itemOneParameterHuman)[];
}

type MenuHuman =
  | MenuSettingOneParameterHuman
  | MenuSettingOneSelectHuman
  | MenuSettingMultySelectHuman
  | MenuSettingMultyGroupHuman;

function calculadeFactor(factor: number): number {
  return factor == 0 ? 1.0 : factor > 0 ? factor : 1.0 / Math.abs(factor);
}

interface CalculateShowValueParams {
  value: number;
  factor: number;
  addition: number;
  offset: number;
}

function calculaedhowValue({
  value,
  factor,
  addition,
  offset,
}: CalculateShowValueParams): number {
  return (value - offset) * calculadeFactor(factor) - addition;
}

function humanText(text: { english: string; persian: string }): HumanText {
  return {
    english: text.english,
    persian: text.persian,
  };
}

function optionForHuman(option: optionType): OptionHuman {
  return {
    value: option.value,
    description: humanText(option.description),
  };
}

function mapTypeToMenuTypeHuman(type: typeMenuEnum): MenuTypeHuman | null {
  switch (type) {
    case typeMenuEnum.SETTING_ON_PARAMETER:
      return MenuTypeHuman.SETTING_ON_PARAMETER;
    case typeMenuEnum.SETTING_ON_SELECT:
      return MenuTypeHuman.SETTING_ON_SELECT;
    case typeMenuEnum.SETTING_MULTY_SELECT:
      return MenuTypeHuman.SETTING_MULTI_SELECT;
    case typeMenuEnum.SETTING_MULTY_GROUP:
      return MenuTypeHuman.SETTING_MULTI_GROUP;
    default:
      return null;
  }
}

function itemOneParameterForHuman(
  setting: settingOneParameterType,
): itemOneParameterHuman {
  return {
    type: MenuTypeHuman.SETTING_ON_PARAMETER,
    label: setting.label,
    unit: setting.unit,
    minValue: calculaedhowValue({
      value: setting.minValue,
      offset: setting.offset,
      addition: setting.addition,
      factor: setting.factor,
    }),
    maxValue: calculaedhowValue({
      value: setting.maxValue,
      offset: setting.offset,
      addition: setting.addition,
      factor: setting.factor,
    }),
    step: calculadeFactor(setting.factor),
    description: humanText(setting.description),
  };
}

function itemOneSelectForHuman(
  setting: settingOneSelectType,
): itemOneSelectHuman {
  return {
    type: MenuTypeHuman.SETTING_ON_SELECT,
    label: setting.label,
    description: humanText(setting.description),
    options: setting.options.map(optionForHuman),
  };
}

function groupItemForHuman(
  item: settingMultyGroupType,
): itemOneSelectHuman | itemOneParameterHuman | null {
  if (item.settingOneParameter) {
    return itemOneParameterForHuman(item.settingOneParameter);
  }

  if (item.settingOneSelect) {
    return itemOneSelectForHuman(item.settingOneSelect);
  }

  return null;
}

function mapMenuToHuman(
  allmenus: menuType[],
  menu: menuType,
): MenuHuman | null {
  const menuTypeChecked = checkTypeMenu(menu);
  const humanType = mapTypeToMenuTypeHuman(menuTypeChecked);
  if (!humanType) return null;

  const base = {
    id: menu.id,
    label: menu.lable ?? "",
    type: humanType,
  };

  switch (menuTypeChecked) {
    case typeMenuEnum.SETTING_ON_PARAMETER: {
      const setting = menu.data.settingOneParameter;
      if (!setting) return null;

      const result: MenuSettingOneParameterHuman = {
        ...base,
        navigationToMenu: findAddressMenu(allmenus, menu),
        description: humanText(setting.description),
        unit: setting.unit,
        minValue: calculaedhowValue({
          value: setting.minValue,
          offset: setting.offset,
          addition: setting.addition,
          factor: setting.factor,
        }),
        maxValue: calculaedhowValue({
          value: setting.maxValue,
          offset: setting.offset,
          addition: setting.addition,
          factor: setting.factor,
        }),
        step: calculadeFactor(setting.factor),
      };
      return result;
    }

    case typeMenuEnum.SETTING_ON_SELECT: {
      const setting = menu.data.settingOneSelect;
      if (!setting) return null;

      const result: MenuSettingOneSelectHuman = {
        ...base,
        navigationToMenu: findAddressMenu(allmenus, menu),
        description: humanText(setting.description),
        options: (setting.options ?? []).map(optionForHuman),
      };
      return result;
    }

    case typeMenuEnum.SETTING_MULTY_SELECT: {
      const setting = menu.data.settingMultySelect;
      if (!setting) return null;

      const result: MenuSettingMultySelectHuman = {
        ...base,
        navigationToMenu: findAddressMenu(allmenus, menu),
        description: humanText(setting.description),
        options: (setting.options ?? []).map(optionForHuman),
        itemLabels: (setting.itemLabels ?? []).map(optionForHuman),
      };
      return result;
    }

    case typeMenuEnum.SETTING_MULTY_GROUP: {
      const group = menu.data.settingMultyGroup;
      if (!group?.length) return null;

      const settings = group
        .map(groupItemForHuman)
        .filter(
          (item): item is itemOneSelectHuman | itemOneParameterHuman =>
            item !== null,
        );

      const result: MenuSettingMultyGroupHuman = {
        ...base,
        navigationToMenu: findAddressMenu(allmenus, menu),
        description: humanText(menu.description),
        settings,
      };
      return result;
    }

    default:
      return null;
  }
}

export function menusForHuman(allmenus: menuType[]): MenuHuman[] {
  return allmenus
    .map((menu) => mapMenuToHuman(allmenus, menu))
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
