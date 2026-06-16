import { create } from "zustand";
import {
  DescriptionType,
  menuType,
  MiniDescriptionType,
  optionType,
  ParanetIdLableType,
} from "../type/menu_type";
import { END_POINT_MENU_ADVANCE } from "../constant/apiUrl";

type structureOneParameterType = {
  address: number;
  default: number;
  offset: number;
  addition: number;
  unit: string;
  factor: number;
  minValue: number;
  maxValue: number;
  label: string;
};

type structureOneSelectType = {
  default: number;
  address: number;
  label: string;
};

type structureMultySelectType = {
  defaults: number[];
  addresses: number[];
};

export enum boardEnum {
  advance = "advance",
  terse = "terse",
}
type menuStorType = {
  board: boardEnum;
  setBoard: (board: boardEnum) => void;

  endPointMenu: string;
  setEndPointMenu: (newEndPoint: string) => void;

  refreshTick: number;
  refreshMenu: () => void;
  currentMenuId: string;
  setCurrentMenuId: (currentMenuId: string) => void;

  description: DescriptionType;
  setDescription: (description: DescriptionType) => void;

  descriptionAi: MiniDescriptionType;
  setDescriptionAi: (descriptionAi: MiniDescriptionType) => void;

  options: optionType[];
  setOptions: (options: optionType[]) => void;

  items: optionType[];
  setItems: (items: optionType[]) => void;

  structureOneParameter: structureOneParameterType;
  setStructureOneParameter: (
    structureOneParameter: structureOneParameterType,
  ) => void;

  structureOneSelect: structureOneSelectType;
  setStructureOneSelect: (structureOneSelect: structureOneSelectType) => void;

  structureMultySelect: structureMultySelectType;
  setStructureMultySelect: (
    structureMultySelect: structureMultySelectType,
  ) => void;

  parent: ParanetIdLableType[];
  setParent: (parent: ParanetIdLableType[]) => void;

  allMenus: menuType[];
  setAllMenus: (allMenus: menuType[]) => void;
};

export const emptyDescription: DescriptionType = {
  english: "",
  persian: "",
  arabic: "",
  turkish: "",
  russian: "",
  german: "",
};

export const emptyMiniDescription: MiniDescriptionType = {
  english: "",
  persian: "",
};

export const emptyStructureOneParameter: structureOneParameterType = {
  address: 0,
  default: 0,
  offset: 0,
  addition: 0,
  unit: "",
  factor: 0,
  minValue: 0,
  maxValue: 0,
  label: "",
};

export const emptyStructureOneSelect: structureOneSelectType = {
  default: 0,
  address: 0,
  label: "",
};

export const emptyStructureMultySelect: structureMultySelectType = {
  defaults: [],
  addresses: [],
};

export const useMenuStore = create<menuStorType>((set) => ({
  board: boardEnum.advance,
  setBoard: (board) => set((state) => ({ board: board })),
  endPointMenu: END_POINT_MENU_ADVANCE,
  setEndPointMenu: (newEndPoint) =>
    set((state) => ({ endPointMenu: newEndPoint })),
  refreshTick: 0,
  refreshMenu: () => set((state) => ({ refreshTick: state.refreshTick + 1 })),
  currentMenuId: "0",
  setCurrentMenuId: (currentMenuId) => set({ currentMenuId }),

  allMenus: [],
  setAllMenus: (allMenus) => set({ allMenus }),
  description: { ...emptyDescription },
  setDescription: (description) => set({ description }),

  descriptionAi: { ...emptyMiniDescription },
  setDescriptionAi: (descriptionAi) => set({ descriptionAi }),

  options: [],
  setOptions: (options) => set({ options }),

  items: [],
  setItems: (items) => set({ items }),

  structureOneParameter: { ...emptyStructureOneParameter },
  setStructureOneParameter: (structureOneParameter) =>
    set({ structureOneParameter }),

  structureOneSelect: { ...emptyStructureOneSelect },
  setStructureOneSelect: (structureOneSelect) => set({ structureOneSelect }),

  structureMultySelect: { ...emptyStructureMultySelect },
  setStructureMultySelect: (structureMultySelect) =>
    set({ structureMultySelect }),

  parent: [],
  setParent: (parent) => set({ parent }),
}));
