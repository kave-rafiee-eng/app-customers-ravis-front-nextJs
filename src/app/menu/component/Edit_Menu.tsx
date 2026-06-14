"use client";

import React, { useEffect } from "react";
import {
  DescriptionType,
  menuType,
  MiniDescriptionType,
  settingMultySelectType,
  settingOneParameterType,
  settingOneSelectType,
  typeMenuEnum,
} from "../type/menu_type";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { useSnackBarError } from "../../stors/snakebar-store";
import { API_MENU, END_POINT_MENU_ADVANCE } from "../constant/apiUrl";
import EditSettingOneParameter from "./Edit_oneParameter";
import { useMenuStore } from "../store/menu_store";
import {
  initStoreMenu,
  initStoreMenuGroup,
} from "../initStorMenu/initStorMenu";
import saveAndCollectMenu from "../saveAndCollectMenu/saveAndCollectMenu";
import { checkTypeMenu } from "../type/checkTypeMenu";
import EditSettingOneSelect from "./Edit_oneSelect";
import EditSettingMultySelect from "./Edit_multiSelect";

type EditMenuPropsType = {
  idEdit: string;
  allMenus: menuType[];
};

function findMenuById(id: string, menus: menuType[]): menuType | undefined {
  return menus.find((menu) => menu.id === id);
}

export default function EditMenu({ idEdit, allMenus }: EditMenuPropsType) {
  React.useEffect(() => {
    console.log("---- RENDER : EditMenu");
  });

  const [menuState, setMenuState] = React.useState<menuType>();
  const [saveing, setSaveing] = React.useState(false);
  const [activeIndexGroup, setActiveIndexGroup] = React.useState(0);
  const addMessage = useSnackBarError((state) => state.addMessage);

  useEffect(() => {
    async function getMenu(id: string) {
      try {
        const resault = await API_MENU.get(
          `${END_POINT_MENU_ADVANCE}/${idEdit}`,
        );
        setMenuState(resault.data);
      } catch (err) {
        console.log(err);
        addMessage("connection error", "error");
      }
    }
    getMenu(idEdit);
  }, [idEdit]);

  const navigations = React.useMemo(() => {
    const result: string[][] = [];
    function findPaths(menuId: string, path: string[] = []) {
      const menu = findMenuById(menuId, allMenus);
      if (!menu) return;
      if (!menu.parentId?.length) {
        result.push(path);
        return;
      }
      for (const parent of menu.parentId) {
        findPaths(parent.id, [...path, parent.label as string]);
      }
    }
    menuState?.parentId?.forEach((parent) => {
      findPaths(parent.id);
    });
    return result;
  }, [menuState, allMenus]);

  const initStore = () => {
    if (menuState == undefined) return;
    initStoreMenu(menuState);
  };
  const initStoreGroup = () => {
    if (menuState == undefined) return;
    initStoreMenuGroup(menuState, activeIndexGroup);
  };
  React.useEffect(() => {
    const menuTypeChecked = checkTypeMenu(menuState);
    if (
      menuTypeChecked === typeMenuEnum.SETTING_ON_PARAMETER ||
      menuTypeChecked === typeMenuEnum.SETTING_ON_SELECT ||
      menuTypeChecked === typeMenuEnum.SETTING_MULTY_SELECT
    ) {
      initStore();
    }
    if (menuTypeChecked == typeMenuEnum.SETTING_MULTY_GROUP) {
      initStoreGroup();
    }
  }, [menuState, activeIndexGroup]);

  let handleSava = async () => {
    if (menuState == undefined) return;
    setSaveing(true);

    const menuTypeChecked = checkTypeMenu(menuState);
    if (
      menuTypeChecked === typeMenuEnum.SETTING_ON_PARAMETER ||
      menuTypeChecked === typeMenuEnum.SETTING_ON_SELECT ||
      menuTypeChecked === typeMenuEnum.SETTING_MULTY_SELECT
    ) {
      try {
        setMenuState(await saveAndCollectMenu(menuState));
        addMessage("saved .", "succes");
      } catch (err) {
        addMessage("error", "error");
      }
    } else {
      addMessage("unsupported menu type", "error");
    }

    setSaveing(false);
  };

  let activeEdit_oneSelect: boolean = false;
  let activeEdit_oneParameter: boolean = false;

  if (checkTypeMenu(menuState) == typeMenuEnum.SETTING_MULTY_GROUP) {
    if (
      menuState?.data.settingMultyGroup![activeIndexGroup].settingOneParameter
    )
      activeEdit_oneParameter = true;

    if (menuState?.data.settingMultyGroup![activeIndexGroup].settingOneSelect)
      activeEdit_oneSelect = true;
  }

  return (
    <Stack direction={"column"} spacing={1} sx={{ height: "100%" }}>
      <Stack
        direction={"row"}
        spacing={1}
        sx={{ background: "#456882" }}
        boxShadow={1}
        p={0.5}
        justifyContent={"space-evenly"}
        alignItems={"center"}
        padding={1}
        borderRadius={2}
      >
        <Typography variant="h6" p={0.2}>
          id : {idEdit}
        </Typography>

        <Typography variant="h6" p={0.2}>
          {menuState?.lable}
        </Typography>

        {checkTypeMenu(menuState) == typeMenuEnum.SETTING_MULTY_GROUP && (
          <FormControl color="primary">
            <InputLabel id="demo-simple-select-label">Items</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Navgation"
              value={activeIndexGroup}
              size="small"
              color="primary"
              sx={{ background: "white" }}
              onChange={(event) => {
                setActiveIndexGroup(Number(event.target.value));
              }}
            >
              {menuState!.data.settingMultyGroup!.map(
                (settingMultyGroup, index) => {
                  let name = "";
                  if (settingMultyGroup.settingOneParameter)
                    name = settingMultyGroup.settingOneParameter.label;
                  if (settingMultyGroup.settingOneSelect)
                    name = settingMultyGroup.settingOneSelect.label;
                  return (
                    <MenuItem key={index} value={index}>
                      {name}
                    </MenuItem>
                  );
                },
              )}
            </Select>
          </FormControl>
        )}

        <FormControl color="primary">
          <InputLabel id="demo-simple-select-label">navigation</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Navgation"
            value={0}
            size="small"
            color="primary"
            sx={{ background: "white" }}
          >
            {navigations.map((path, index) => {
              let nav = "";
              for (let i = path.length - 1; i >= 0; i--) {
                nav += path[i] + "/";
              }
              return (
                <MenuItem key={index + 1} value={index}>
                  {nav}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={handleSava}
          sx={{ background: "white" }}
        >
          {" "}
          save
        </Button>
      </Stack>

      {checkTypeMenu(menuState) == typeMenuEnum.SETTING_ON_PARAMETER && (
        <EditSettingOneParameter />
      )}

      {checkTypeMenu(menuState) == typeMenuEnum.SETTING_ON_SELECT && (
        <EditSettingOneSelect />
      )}

      {checkTypeMenu(menuState) == typeMenuEnum.SETTING_MULTY_SELECT && (
        <EditSettingMultySelect />
      )}

      {activeEdit_oneParameter && <EditSettingOneParameter />}

      {activeEdit_oneSelect && <EditSettingOneSelect />}
    </Stack>
  );
}
