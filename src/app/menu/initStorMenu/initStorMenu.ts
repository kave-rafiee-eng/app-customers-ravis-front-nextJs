import { useMenuStore } from "../store/menu_store";
import { checkTypeMenu } from "../type/checkTypeMenu";
import {
  DescriptionType,
  menuType,
  MiniDescriptionType,
  settingMultySelectType,
  settingOneParameterType,
  settingOneSelectType,
  typeMenuEnum,
} from "../type/menu_type";

const emptyDescription: DescriptionType = {
  english: "",
  persian: "",
  arabic: "",
  turkish: "",
  russian: "",
  german: "",
};

const emptyMiniDescription: MiniDescriptionType = {
  english: "",
  persian: "",
};

export function resetMenuStore() {
  useMenuStore.setState({
    description: { ...emptyDescription },
    descriptionAi: { ...emptyMiniDescription },
    options: [],
    items: [],
    structureOneParameter: {
      address: 0,
      default: 0,
      offset: 0,
      addition: 0,
      unit: "",
      factor: 0,
      minValue: 0,
      maxValue: 0,
      label: "",
    },
    structureOneSelect: {
      default: 0,
      address: 0,
      label: "",
    },
    structureMultySelect: {
      defaults: [],
      addresses: [],
    },
    parent: [],
  });
}

export function initStoreMenu_settingOneParameter(
  settingOneParameter: settingOneParameterType,
) {
  resetMenuStore();
  useMenuStore.setState({
    description: settingOneParameter.description,
    descriptionAi: settingOneParameter.additional_description_for_ai_assistant,
    structureOneParameter: {
      address: settingOneParameter.address,
      default: settingOneParameter.default,
      offset: settingOneParameter.offset,
      addition: settingOneParameter.addition,
      unit: settingOneParameter.unit,
      factor: settingOneParameter.factor,
      minValue: settingOneParameter.minValue,
      maxValue: settingOneParameter.maxValue,
      label: settingOneParameter.label,
    },
  });
}

export function initStoreMenu_settingOneSelect(
  settingOneSelect: settingOneSelectType,
) {
  resetMenuStore();
  useMenuStore.setState({
    description: settingOneSelect.description,
    descriptionAi: settingOneSelect.additional_description_for_ai_assistant,
    options: settingOneSelect.options ?? [],
    structureOneSelect: {
      default: settingOneSelect.default,
      address: settingOneSelect.address,
      label: settingOneSelect.label,
    },
  });
}

export function initStoreMenu_settingMultySelect(
  settingMultySelect: settingMultySelectType,
) {
  resetMenuStore();
  useMenuStore.setState({
    description: settingMultySelect.description,
    descriptionAi: settingMultySelect.additional_description_for_ai_assistant,
    options: settingMultySelect.options ?? [],
    items: settingMultySelect.itemLabels ?? [],
    structureMultySelect: {
      defaults: settingMultySelect.defaults ?? [],
      addresses: settingMultySelect.addresses ?? [],
    },
  });
}

export function initStoreMenu_subMenu(menu: menuType) {
  resetMenuStore();
  useMenuStore.setState({
    description: menu.description,
    descriptionAi: menu.additional_description_for_ai_assistant,
    parent: menu.parentId,
  });
}

export function initStoreMenu(menu: menuType) {
  const type = checkTypeMenu(menu);

  switch (type) {
    case typeMenuEnum.SETTING_ON_PARAMETER:
      initStoreMenu_settingOneParameter(menu.data.settingOneParameter!);
      break;

    case typeMenuEnum.SETTING_ON_SELECT:
      initStoreMenu_settingOneSelect(menu.data.settingOneSelect!);
      break;

    case typeMenuEnum.SETTING_MULTY_SELECT:
      initStoreMenu_settingMultySelect(menu.data.settingMultySelect!);
      break;

    case typeMenuEnum.SUBMENU:
      initStoreMenu_subMenu(menu);
      break;
    default:
      resetMenuStore();
  }

  useMenuStore.setState({ parent: menu.parentId });
}

export function initStoreMenuGroup(menu: menuType, activeItemIndex: number) {
  const settingMultySelect = menu.data.settingMultyGroup!;

  const activeItem = settingMultySelect[activeItemIndex];

  if (activeItem.settingOneParameter) {
    initStoreMenu_settingOneParameter(activeItem.settingOneParameter);
  }

  if (activeItem.settingOneSelect) {
    initStoreMenu_settingOneSelect(activeItem.settingOneSelect);
  }

  useMenuStore.setState({ parent: menu.parentId });
}

/** @deprecated use initStoreMenu_settingOneParameter */
// export const initSoreMenu_settingOneParameter =
//   initStoreMenu_settingOneParameter;
