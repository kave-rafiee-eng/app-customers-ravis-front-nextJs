"use client";

import React, { useEffect } from "react";
import {
  DescriptionType,
  menuType,
  MiniDescriptionType,
  settingMultyGroupType,
  settingMultySelectType,
  settingOneParameterType,
  settingOneSelectType,
  typeMenuEnum,
} from "../type/menu_type";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Divider,
  Modal,
  TextField,
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
import EditSubMenu from "./Edit_subMenu";
import AddItemToMultyGroup from "../subComponent/addItemToMultiGroup";

type EditMenuPropsType = {
  idEdit: string;
  allMenus: menuType[];
  onDelet: () => void;
};

function findMenuById(id: string, menus: menuType[]): menuType | undefined {
  return menus.find((menu) => menu.id === id);
}

export default function EditMenu({
  idEdit,
  allMenus,
  onDelet,
}: EditMenuPropsType) {
  React.useEffect(() => {
    console.log("---- RENDER : EditMenu");
  });

  const [menuState, setMenuState] = React.useState<menuType>();
  const [saveing, setSaveing] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [activeIndexGroup, setActiveIndexGroup] = React.useState(0);
  const [openModalAddItemToMultiGroup, setOpenModalAddItemToMultiGroup] =
    React.useState(false);
  const addMessage = useSnackBarError((state) => state.addMessage);
  const setCurrentMenuId = useMenuStore((state) => state.setCurrentMenuId);
  const refreshMenu = useMenuStore((state) => state.refreshMenu);

  useEffect(() => {
    async function getMenu(id: string) {
      try {
        const resault = await API_MENU.get(
          `${useMenuStore.getState().endPointMenu}/${idEdit}`,
        );
        setMenuState(resault.data);
      } catch (err) {
        console.log(err);
        addMessage("connection error", "error");
      }
    }
    getMenu(idEdit);
    setActiveIndexGroup(0);
    setCurrentMenuId(idEdit);
  }, [idEdit]);

  const navigations = React.useMemo(() => {
    const setAllMenus = useMenuStore((state) => state.setAllMenus);
    setAllMenus(allMenus);
    const result: string[][] = [];
    function findPaths(menuId: string, path: string[] = []) {
      const menu = findMenuById(menuId, allMenus);
      if (!menu) return;
      if (menu.parentId.length == 0) {
        result.push([...path, "main"]);
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
      menuTypeChecked === typeMenuEnum.SETTING_MULTY_SELECT ||
      menuTypeChecked == typeMenuEnum.SUBMENU
    ) {
      initStore();
    }
    if (menuTypeChecked == typeMenuEnum.SETTING_MULTY_GROUP) {
      initStoreGroup();
    }
  }, [menuState, activeIndexGroup]);

  const handleDelet = async () => {
    if (menuState == undefined) return;
    setSaveing(true);

    try {
      await API_MENU.delete(
        `${useMenuStore.getState().endPointMenu}/${menuState.id}`,
      );
      setMenuState(undefined);
      setOpenDeleteDialog(false);
      addMessage("deleted .", "succes");
      setTimeout(() => {
        refreshMenu();
      }, 1000);
      onDelet();
    } catch (err) {
      console.log(err);
      addMessage("error", "error");
    }
    setSaveing(false);
  };

  let handleSava = async () => {
    if (menuState == undefined) return;
    setSaveing(true);

    const menuTypeChecked = checkTypeMenu(menuState);
    if (
      menuTypeChecked === typeMenuEnum.SETTING_ON_PARAMETER ||
      menuTypeChecked === typeMenuEnum.SETTING_ON_SELECT ||
      menuTypeChecked === typeMenuEnum.SETTING_MULTY_SELECT ||
      menuTypeChecked == typeMenuEnum.SUBMENU
    ) {
      try {
        setMenuState(await saveAndCollectMenu(menuState));
        addMessage("saved .", "succes");
        setTimeout(() => {
          refreshMenu();
        }, 1000);
        //
      } catch (err) {
        addMessage("error", "error");
      }
    } else if (menuTypeChecked === typeMenuEnum.SETTING_MULTY_GROUP) {
      try {
        setMenuState(await saveAndCollectMenu(menuState, activeIndexGroup));
        addMessage("saved .", "succes");
        setTimeout(() => {
          refreshMenu();
        }, 1000);
      } catch (err) {
        addMessage("error", "error");
      }
    } else {
      addMessage("unsupported menu type", "error");
    }

    setSaveing(false);
  };

  const handleDeleteGroupItem = () => {
    if (!menuState?.data.settingMultyGroup) return;

    const group = menuState.data.settingMultyGroup;
    if (group.length <= 1) {
      addMessage("cannot delete last item", "error");
      return;
    }

    const nextGroup = group.filter((_, index) => index !== activeIndexGroup);
    const nextIndex = Math.min(activeIndexGroup, nextGroup.length - 1);

    setMenuState({
      ...menuState,
      data: {
        ...menuState.data,
        settingMultyGroup: nextGroup,
      },
    });
    setActiveIndexGroup(nextIndex);
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
    <Stack
      direction={"column"}
      spacing={1}
      // sx={{ height: "100%" }}
    >
      {checkTypeMenu(menuState) == typeMenuEnum.SETTING_MULTY_GROUP && (
        <Modal
          open={openModalAddItemToMultiGroup}
          onClose={() => {
            setOpenModalAddItemToMultiGroup(false);
          }}
        >
          <AddItemToMultyGroup
            onCancel={() => {
              setOpenModalAddItemToMultiGroup(false);
            }}
            onSuccess={() => {
              addMessage("add item .", "succes");
            }}
            menu={menuState!}
            setMenuState={setMenuState}
          />
        </Modal>
      )}

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={1.5}
        sx={{
          background: "#456882",
          color: "white",
          boxShadow: 1,
          p: 1.5,
          borderRadius: 2,
          alignItems: { xs: "stretch", lg: "center" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ minWidth: 0 }}
          justifyContent={"space-evenly"}
        >
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            id: {idEdit}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: "rgba(255,255,255,0.35)" }}
          />
          {/* <Typography variant="subtitle1" fontWeight={600} noWrap>
            {menuState?.lable}
          </Typography> */}
          <TextField
            size="small"
            value={menuState?.lable}
            onChange={(event) => {
              setMenuState((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  lable: event.target.value,
                };
              });
            }}
            variant="standard"
          />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: "rgba(255,255,255,0.35)" }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleSava}
            sx={{
              background: "white",
              borderColor: "rgba(255,255,255,0.6)",
              color: "#456882",
              fontWeight: 600,
            }}
          >
            save
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenDeleteDialog(true)}
            color="error"
          >
            delet
          </Button>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ minWidth: 0 }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            noWrap
            color="textPrimary"
          >
            navigation :
          </Typography>
          {navigations.length ? (
            <FormControl color="primary" size="small" sx={{ minWidth: 180 }}>
              {/* <InputLabel id="edit-menu-navigation-label">navigation</InputLabel> */}
              <Select
                // labelId="edit-menu-navigation-label"
                id="edit-menu-navigation"
                // label="navigation"
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
          ) : (
            "Free"
          )}
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ flex: 1, justifyContent: { xs: "flex-start", lg: "center" } }}
        >
          {checkTypeMenu(menuState) == typeMenuEnum.SETTING_MULTY_GROUP && (
            <FormControl color="primary" size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="edit-menu-items-label">Items</InputLabel>
              <Select
                labelId="edit-menu-items-label"
                id="edit-menu-items"
                label="Items"
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
          {checkTypeMenu(menuState) == typeMenuEnum.SETTING_MULTY_GROUP && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setOpenModalAddItemToMultiGroup(true);
                }}
                sx={{ background: "white", color: "#456882" }}
              >
                addItem
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={handleDeleteGroupItem}
              >
                deleteItem
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Dialog
        open={openDeleteDialog}
        onClose={() => !saveing && setOpenDeleteDialog(false)}
      >
        <DialogTitle>delete menu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            are you sure you want to delete menu{" "}
            <strong>{menuState?.lable ?? menuState?.id ?? idEdit}</strong> (id:{" "}
            {menuState?.id ?? idEdit})? this action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={saveing}>
            cancel
          </Button>
          <Button
            onClick={handleDelet}
            color="error"
            variant="contained"
            disabled={saveing}
          >
            {saveing ? "deleting..." : "delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {checkTypeMenu(menuState) == typeMenuEnum.SETTING_ON_PARAMETER && (
        <EditSettingOneParameter />
      )}

      {checkTypeMenu(menuState) == typeMenuEnum.SETTING_ON_SELECT && (
        <EditSettingOneSelect />
      )}

      {checkTypeMenu(menuState) == typeMenuEnum.SETTING_MULTY_SELECT && (
        <EditSettingMultySelect />
      )}

      {checkTypeMenu(menuState) == typeMenuEnum.SUBMENU && <EditSubMenu />}

      {activeEdit_oneParameter && <EditSettingOneParameter />}

      {activeEdit_oneSelect && <EditSettingOneSelect />}
    </Stack>
  );
}
