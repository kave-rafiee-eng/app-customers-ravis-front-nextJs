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
  Items = "Items",
  Parent = "Parent",
}

type propsType = {};

export default function EditMultiGroup({}: propsType) {
  const [tab, setTab] = React.useState<SettingTab>(SettingTab.Description);

  const handleChange = (event: React.SyntheticEvent, newValue: SettingTab) => {
    setTab(newValue);
  };

  const currentMenuId = useMenuStore((state) => state.currentMenuId);

  const allMenus = useMenuStore((state) => state.allMenus);

  const menu = allMenus.find((menu) => menu.id == currentMenuId);

  const settingMultyGroup = menu?.data.settingMultyGroup;
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
          {Object.entries(SettingTab).map((v, index) => (
            <Tab key={index} value={v[0]} label={v[1]} />
          ))}
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
          hidden={tab !== SettingTab.Items}
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
            {settingMultyGroup?.map((setting, index) => {
              let name = "";
              if (setting.settingOneParameter)
                name = setting.settingOneParameter.label;
              if (setting.settingOneSelect)
                name = setting.settingOneSelect.label;
              return (
                <Box key={index} boxShadow={1} pl={2} pr={2}>
                  <Typography>{name}</Typography>
                </Box>
              );
            })}
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
