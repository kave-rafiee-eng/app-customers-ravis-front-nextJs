import { useMenuStore } from "../store/menu_store";
import { checkTypeMenu } from "../type/checkTypeMenu";
import { menuType, typeMenuEnum } from "../type/menu_type";
import { API_MENU, END_POINT_MENU_ADVANCE } from "../constant/apiUrl";

export async function postMenu(menu: menuType): Promise<menuType> {
  try {
    const res = await API_MENU.post(useMenuStore.getState().endPointMenu, menu);
    return res.data as menuType;
  } catch (err) {
    console.log(err);
    throw new Error("connection error");
  }
}

export async function saveAndCollectMenu_subMenu(
  menu: menuType,
): Promise<menuType> {
  const store = useMenuStore.getState();
  const updateMenu: menuType = {
    ...menu,
    parentId: store.parent,
    description: store.description,
    additional_description_for_ai_assistant: store.descriptionAi,
    data: {
      ...menu.data,
    },
  };

  return postMenu(updateMenu);
}

export async function saveAndCollectMenu_settingOneParameter(
  menu: menuType,
): Promise<menuType> {
  const store = useMenuStore.getState();
  const structure = store.structureOneParameter;

  const updateMenu: menuType = {
    ...menu,
    parentId: store.parent,
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
    parentId: store.parent,
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
    parentId: store.parent,
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

export async function saveAndCollectMenu_settingMultyGroup(
  menu: menuType,
  activeItemIndex: number,
): Promise<menuType> {
  const store = useMenuStore.getState();
  const group = [...(menu.data.settingMultyGroup ?? [])];

  if (activeItemIndex < 0 || activeItemIndex >= group.length) {
    throw new Error("invalid group item index");
  }

  const activeItem = { ...group[activeItemIndex] };

  if (activeItem.settingOneParameter) {
    const structure = store.structureOneParameter;
    activeItem.settingOneParameter = {
      ...activeItem.settingOneParameter,
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
    };
  }

  if (activeItem.settingOneSelect) {
    const structure = store.structureOneSelect;
    activeItem.settingOneSelect = {
      ...activeItem.settingOneSelect,
      description: store.description,
      additional_description_for_ai_assistant: store.descriptionAi,
      options: store.options,
      default: structure.default,
      address: structure.address,
      label: structure.label,
    };
  }

  group[activeItemIndex] = activeItem;

  const updateMenu: menuType = {
    ...menu,
    parentId: store.parent,
    data: {
      ...menu.data,
      settingMultyGroup: group,
    },
  };

  return postMenu(updateMenu);
}

export default async function saveAndCollectMenu(
  menu: menuType,
  activeItemIndex?: number,
): Promise<menuType> {
  const type = checkTypeMenu(menu);

  switch (type) {
    case typeMenuEnum.SUBMENU:
      return saveAndCollectMenu_subMenu(menu);

    case typeMenuEnum.SETTING_ON_PARAMETER:
      return saveAndCollectMenu_settingOneParameter(menu);

    case typeMenuEnum.SETTING_ON_SELECT:
      return saveAndCollectMenu_settingOneSelect(menu);

    case typeMenuEnum.SETTING_MULTY_SELECT:
      return saveAndCollectMenu_settingMultySelect(menu);

    case typeMenuEnum.SETTING_MULTY_GROUP:
      if (activeItemIndex === undefined) {
        throw new Error("activeItemIndex is required for SETTING_MULTY_GROUP");
      }
      return saveAndCollectMenu_settingMultyGroup(menu, activeItemIndex);

    default:
      throw new Error("unsupported menu type");
  }
}
