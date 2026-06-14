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

enum SettingTab {
  Description = "Description",
  Structure = "Structure",
}

type propsType = {};
export default function EditSettingOneParameter({}: propsType) {
  const [tab, setTab] = React.useState<SettingTab>(SettingTab.Description);

  const handleChange = (event: React.SyntheticEvent, newValue: SettingTab) => {
    setTab(newValue);
  };

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
          <Tab value={SettingTab.Structure} label="Structure" />
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
          hidden={tab !== SettingTab.Structure}
          style={{
            width: "100%",
            height: "80%",
            maxHeight: "80%",
            overflowY: "auto",
          }}
        >
          <EditStructur_settingOneParameter />
        </div>
      </Box>
    </>
  );
}
