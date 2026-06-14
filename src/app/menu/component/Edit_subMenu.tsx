import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import {
  menuType,
  DescriptionType,
  settingOneParameterType,
  MiniDescriptionType,
} from "../type/menu_type";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";
import EditDescription from "../subComponent/Edit_description";
import EditDescriptionAi from "../subComponent/Edit_descriptionAi";
import EditStructur_settingOneParameter from "../subComponent/EditStructur_settingOneParameter";
import EditParent from "../subComponent/Edit_parent";
import { useMenuStore } from "../store/menu_store";

enum SettingTab {
  Description = "Description",
  SubMenus = "SubMenus",
  Parent = "Parent",
}

type propsType = {};

export default function EditSubMenu({}: propsType) {
  const [tab, setTab] = React.useState<SettingTab>(SettingTab.Description);

  const handleChange = (event: React.SyntheticEvent, newValue: SettingTab) => {
    setTab(newValue);
  };

  const currentMenuId = useMenuStore((state) => state.currentMenuId);

  const allMenus = useMenuStore((state) => state.allMenus);

  let listSubMenus: string[] = [];
  allMenus.forEach((menu) => {
    menu.parentId.forEach((parent) => {
      if (parent.id == currentMenuId) {
        listSubMenus.push(`${parent.label} ( ${menu.id} )`);
      }
    });
  });

  return (
    <>
      <Box sx={{ width: "100%", height: "80%" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={SettingTab.Description} label="Description" />
          <Tab value={SettingTab.SubMenus} label="SubMenus" />
          <Tab value={SettingTab.Parent} label="Parent" />
        </Tabs>

        <div
          hidden={tab !== SettingTab.Description}
          style={{
            width: "100%",
            height: "80%",
            maxHeight: "80%",
            overflowY: "auto",
          }}
        >
          <EditDescription />
          <EditDescriptionAi />
        </div>
        <div
          hidden={tab !== SettingTab.SubMenus}
          style={{
            width: "100%",
            height: "80%",
            maxHeight: "80%",
            overflowY: "auto",
          }}
        >
          <Stack
            spacing={1}
            sx={{
              width: "100%",
              alignContent: "center",
              alignItems: "center",
            }}
            mt={5}
          >
            {listSubMenus.map((name) => (
              <Box key={name} boxShadow={1} pl={2} pr={2}>
                <Typography>{name}</Typography>
              </Box>
            ))}
          </Stack>
        </div>
        <div
          hidden={tab !== SettingTab.Parent}
          style={{
            width: "100%",
            height: "80%",
            maxHeight: "80%",
            overflowY: "auto",
          }}
        >
          <EditParent />
        </div>
      </Box>
    </>
  );
}
