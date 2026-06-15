"use client";

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import EditDescription from "../subComponent/Edit_description";
import EditDescriptionAi from "../subComponent/Edit_descriptionAi";
import EditOptions from "../subComponent/Edit_options";
import EditStructur_settingMultySelect from "../subComponent/EditStructur_settingMultySelect";
import EditParent from "../subComponent/Edit_parent";

enum SettingTab {
  Description = "Description",
  Structure = "Structure",
  Options = "Options",
  Items = "Items",
  Parent = "Parent",
}

export default function EditSettingMultySelect() {
  const [tab, setTab] = React.useState<SettingTab>(SettingTab.Description);

  const handleChange = (_event: React.SyntheticEvent, newValue: SettingTab) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", height: "80%" }}>
      <Tabs
        value={tab}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
      >
        {Object.entries(SettingTab).map((v, index) => (
          <Tab key={index} value={v[0]} label={v[1]} />
        ))}
      </Tabs>

      <Box
        hidden={tab !== SettingTab.Description}
        sx={{
          width: "100%",
          height: "80%",
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        <EditDescription />
        <EditDescriptionAi />
      </Box>

      <Box
        hidden={tab !== SettingTab.Structure}
        sx={{
          width: "100%",
          height: "80%",
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        <EditStructur_settingMultySelect />
      </Box>

      <Box
        hidden={tab !== SettingTab.Options}
        sx={{
          width: "100%",
          height: "90%",
          maxHeight: "100%",
          overflowY: "auto",
        }}
      >
        <EditOptions editItem={false} />
      </Box>

      <Box
        hidden={tab !== SettingTab.Items}
        sx={{
          width: "100%",
          height: "90%",
          maxHeight: "100%",
          overflowY: "auto",
        }}
      >
        <EditOptions editItem={true} />
      </Box>

      <Box
        hidden={tab !== SettingTab.Parent}
        sx={{
          width: "100%",
          height: "90%",
          maxHeight: "100%",
          overflowY: "auto",
        }}
      >
        <EditParent></EditParent>
      </Box>
    </Box>
  );
}
