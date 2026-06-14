import { useMenuStore } from "../store/menu_store";
import { checkTypeMenu } from "../type/checkTypeMenu";
import { menuType, typeMenuEnum } from "../type/menu_type";
import { API_MENU, END_POINT_MENU_ADVANCE } from "../constant/apiUrl";

async function postMenu(menu: menuType): Promise<menuType> {
  try {
    const res = await API_MENU.post(END_POINT_MENU_ADVANCE, menu);
    return res.data as menuType;
  } catch (err) {
    console.log(err);
    throw new Error("connection error");
  }
}

export async function saveAndCollectMenu_settingOneParameter(
  menu: menuType,
): Promise<menuType> {
  const store = useMenuStore.getState();
  const structure = store.structureOneParameter;

  const updateMenu: menuType = {
    ...menu,
    data: {
      ...menu.data,
      settingOneParameter: {
        ...menu.data.settingOneParameter!,
        description: store.description,
        additional_description_for_ai_assistant: store.descriptionAi,
        address: structure.address,
        default: structure.default,
        offset: structure.offset,
        addition: structure.addition,
        unit: structure.unit,
        factor: structure.factor,
        minValue: structure.minValue,
        maxValue: structure.maxValue,
        label: structure.label,
      },
    },
  };

  return postMenu(updateMenu);
}

export async function saveAndCollectMenu_settingOneSelect(
  menu: menuType,
): Promise<menuType> {
  const store = useMenuStore.getState();
  const structure = store.structureOneSelect;

  const updateMenu: menuType = {
    ...menu,
    data: {
      ...menu.data,
      settingOneSelect: {
        ...menu.data.settingOneSelect!,
        description: store.description,
        additional_description_for_ai_assistant: store.descriptionAi,
        options: store.options,
        default: structure.default,
        address: structure.address,
        label: structure.label,
      },
    },
  };

  return postMenu(updateMenu);
}

export async function saveAndCollectMenu_settingMultySelect(
  menu: menuType,
): Promise<menuType> {
  const store = useMenuStore.getState();
  const structure = store.structureMultySelect;

  const updateMenu: menuType = {
    ...menu,
    data: {
      ...menu.data,
      settingMultySelect: {
        ...menu.data.settingMultySelect!,
        description: store.description,
        additional_description_for_ai_assistant: store.descriptionAi,
        options: store.options,
        itemLabels: store.items,
        defaults: structure.defaults,
        addresses: structure.addresses,
      },
    },
  };

  return postMenu(updateMenu);
}

export default async function saveAndCollectMenu(
  menu: menuType,
): Promise<menuType> {
  const type = checkTypeMenu(menu);

  switch (type) {
    case typeMenuEnum.SETTING_ON_PARAMETER:
      return saveAndCollectMenu_settingOneParameter(menu);

    case typeMenuEnum.SETTING_ON_SELECT:
      return saveAndCollectMenu_settingOneSelect(menu);

    case typeMenuEnum.SETTING_MULTY_SELECT:
      return saveAndCollectMenu_settingMultySelect(menu);

    default:
      throw new Error("unsupported menu type");
  }
}
