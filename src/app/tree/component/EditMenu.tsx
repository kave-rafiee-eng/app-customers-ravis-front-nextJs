"use client";

import React, { useEffect } from "react";
import {
    menuType,
    settingMultySelectType,
    settingOneParameterType,
    settingOneSelectType,
    typeMenuEnum,
} from "../type/menu-type";
import EditMenu_settingOneParameter from "./EditMenu-settingOneParameter";
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
import EditMenu_settingOneSelect from "./EditMenu-settingOneSelect";
import axios from "axios";
import EditMenu_settingMultySelect from "./EditMenu-settingMultySelect";

type EditMenuPropsType = {
    idEdit: string;
    allMenus: menuType[];
};

function findMenuById(id: string, menus: menuType[]): menuType | undefined {
    return menus.find((menu) => menu.id === id);
}

export default function EditMenu({ idEdit, allMenus }: EditMenuPropsType) {
    const cbRef = React.useRef<(() => void) | null>(null);

    const [menuState, setMenuState] = React.useState<menuType>();
    const [saveing, setSaveing] = React.useState(false);

    const [itemOfMulty, setItemOfMulty] = React.useState(0);
    useEffect(() => {
        async function getMenu(id: string) {
            console.log("get Menu id : " + idEdit);

            try {
                const api = axios.create({
                    // baseURL: "http://localhost:3000",
                    baseURL: "http://10.240.195.179:3000",
                });
                const resault = await api.get(`/menu/${idEdit}`);
                console.log(resault.data);
                setMenuState(resault.data);
                setItemOfMulty(0);
            } catch (err) {
                console.log(err);
            }
        }
        getMenu(idEdit);
    }, [idEdit]);

    type NavigationPath = string[];

    const navigations: NavigationPath[] = [];

    function findPaths(menuId: string, path: string[] = []) {
        const menu = findMenuById(menuId, allMenus);
        if (!menu) return;

        let newPath = [...path];

        if (!menu.parentId?.length) {
            if (menu.lable != undefined) newPath.push(menu.lable as string);
            navigations.push(newPath);
            return;
        }

        for (const parent of menu.parentId) {
            newPath.push(parent.label as string);
            findPaths(parent.id, newPath);
        }
    }

    if (menuState != undefined)
        for (const parent of menuState?.parentId ?? []) {
            findPaths(parent.id);
        }

    const handleSave = async () => {
        if (menuState == undefined) return;
        setSaveing(true);
        const api = axios.create({
            baseURL: "http://localhost:3000",
        });
        const url = `menu/${idEdit}`;

        console.log("saving : ");
        console.log(menuState);
        try {
            const res = await api.patch(url, menuState);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
        setSaveing(false);
    };

    //---------------------------------

    let setItem_oneParameter:
        | ((
              set: (prev: settingOneParameterType) => settingOneParameterType,
          ) => void)
        | undefined = undefined;
    let Item_oneParameter: settingOneParameterType | undefined = undefined;

    let setItem_oneSelect:
        | ((set: (prev: settingOneSelectType) => settingOneSelectType) => void)
        | undefined = undefined;
    let Item_oneSelect: settingOneSelectType | undefined = undefined;

    let setItem_multySelect:
        | ((
              set: (prev: settingMultySelectType) => settingMultySelectType,
          ) => void)
        | undefined = undefined;
    let Item_multySelect: settingMultySelectType | undefined = undefined;
    //---------------------------------

    if (menuState?.type == typeMenuEnum.SETTING_ON_PARAMETER) {
        Item_oneParameter = menuState.data.settingOneParameter;
        setItem_oneParameter = (
            set: (prev: settingOneParameterType) => settingOneParameterType,
        ) => {
            setMenuState((prev) => {
                if (!prev?.data?.settingOneParameter) return prev;
                const newSet = set(prev.data.settingOneParameter);
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        settingOneParameter: newSet,
                    },
                };
            });
        };
    }

    if (menuState?.type == typeMenuEnum.SETTING_ON_SELECT) {
        Item_oneSelect = menuState.data.settingOneSelect;
        setItem_oneSelect = (
            set: (prev: settingOneSelectType) => settingOneSelectType,
        ) => {
            setMenuState((prev) => {
                if (!prev?.data?.settingOneSelect) return prev;
                const newSet = set(prev.data.settingOneSelect);
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        settingOneSelect: newSet,
                    },
                };
            });
        };
    }

    if (menuState?.type == typeMenuEnum.SETTING_MULTY_SELECT) {
        Item_multySelect = menuState.data.settingMultySelect;
        setItem_multySelect = (set) => {
            setMenuState((prev) => {
                if (!prev?.data?.settingMultySelect) return prev;
                const newSet = set(prev.data.settingMultySelect);
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        settingMultySelect: newSet,
                    },
                };
            });
        };
    }

    //------------------------------------------------------
    if (menuState?.type == typeMenuEnum.SETTING_MULTY_GROUP) {
        const items = menuState.data.settingMultyGroup;
        if (items == undefined || items?.length == 0) return;
        const item = items[itemOfMulty];
        if (item.settingOneParameter) {
            Item_oneParameter = item.settingOneParameter;
            setItem_oneParameter = (set) => {
                setMenuState((prev) => {
                    if (!prev?.data?.settingMultyGroup?.length) return prev;
                    const prevItem =
                        prev.data.settingMultyGroup[itemOfMulty]
                            .settingOneParameter;
                    if (prevItem == undefined) return prev;
                    const newSet = set(prevItem);
                    return {
                        ...prev,
                        data: {
                            ...prev.data,
                            settingMultyGroup: prev.data.settingMultyGroup.map(
                                (setItem, index) => {
                                    if (index == itemOfMulty) {
                                        return {
                                            settingOneParameter: newSet,
                                        };
                                    } else return setItem;
                                },
                            ),
                        },
                    };
                });
            };
        }

        if (item.settingOneSelect) {
            Item_oneSelect = item.settingOneSelect;
            setItem_oneSelect = (
                set: (prev: settingOneSelectType) => settingOneSelectType,
            ) => {
                setMenuState((prev) => {
                    if (!prev?.data?.settingMultyGroup?.length) return prev;
                    const prevItem =
                        prev.data.settingMultyGroup[itemOfMulty]
                            .settingOneSelect;
                    if (prevItem == undefined) return prev;
                    const newSet = set(prevItem);
                    return {
                        ...prev,
                        data: {
                            ...prev.data,
                            settingMultyGroup: prev.data.settingMultyGroup.map(
                                (setItem, index) => {
                                    if (index == itemOfMulty) {
                                        return {
                                            settingOneSelect: newSet,
                                        };
                                    } else return setItem;
                                },
                            ),
                        },
                    };
                });
            };
        }
    }

    let multyGroupSelect: string[] = [];
    if (menuState?.data?.settingMultyGroup?.length) {
        menuState.data.settingMultyGroup.map((item) => {
            if (item.settingOneParameter)
                multyGroupSelect.push(item.settingOneParameter.label);
            if (item.settingOneSelect)
                multyGroupSelect.push(item.settingOneSelect.label);
        });
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

                {multyGroupSelect.length ? (
                    <FormControl color="primary">
                        <InputLabel id="demo-simple-select-label">
                            Items
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Navgation"
                            value={itemOfMulty}
                            size="small"
                            color="primary"
                            sx={{ background: "white" }}
                            onChange={(event) => {
                                setItemOfMulty(Number(event.target.value));
                            }}
                        >
                            {multyGroupSelect.map((name, index) => (
                                <MenuItem key={index} value={index}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    ""
                )}

                <FormControl color="primary">
                    <InputLabel id="demo-simple-select-label">
                        navigation
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Navgation"
                        value={0}
                        size="small"
                        color="primary"
                        sx={{ background: "white" }}
                    >
                        <MenuItem key={"test"} value={0}>
                            test
                        </MenuItem>
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
                    onClick={handleSave}
                    sx={{ background: "white" }}
                >
                    {" "}
                    save
                </Button>
            </Stack>

            {saveing ? "saving...." : ""}
            {Item_oneParameter && setItem_oneParameter ? (
                <EditMenu_settingOneParameter
                    setting={Item_oneParameter}
                    setSetting={setItem_oneParameter}
                />
            ) : (
                ""
            )}

            {Item_oneSelect && setItem_oneSelect ? (
                <EditMenu_settingOneSelect
                    setting={Item_oneSelect}
                    setSetting={setItem_oneSelect}
                />
            ) : (
                ""
            )}

            {Item_multySelect && setItem_multySelect ? (
                <EditMenu_settingMultySelect
                    setting={Item_multySelect}
                    setSetting={setItem_multySelect}
                />
            ) : (
                ""
            )}
        </Stack>
    );
}
