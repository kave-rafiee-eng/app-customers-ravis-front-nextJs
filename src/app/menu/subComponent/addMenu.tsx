import * as React from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {
  DescriptionType,
  menuType,
  MiniDescriptionType,
  ParanetIdLableType,
  typeMenuEnum,
} from "../type/menu_type";
import { API_MENU, END_POINT_MENU_ADVANCE } from "../constant/apiUrl";
import { useSnackBarError } from "../../stors/snakebar-store";
import {
  TableBasic,
  TableBasicProps,
} from "@/app/general-components/TableBasic";

import {
  emptyDescription,
  emptyMiniDescription,
  useMenuStore,
} from "../store/menu_store";

type propsType = {
  onSuccess: (id: string) => void;
  onCancel: () => void;
  allMenus: menuType[];
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 520,
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const menuTypeOptions = [
  typeMenuEnum.SUBMENU,
  typeMenuEnum.SETTING_ON_PARAMETER,
  typeMenuEnum.SETTING_ON_SELECT,
  typeMenuEnum.SETTING_MULTY_SELECT,
  typeMenuEnum.SETTING_MULTY_GROUP,
];

function createEmptyMenu(
  id: string,
  lable: string,
  type: typeMenuEnum,
): menuType {
  const base: menuType = {
    id,
    lable,
    type,
    parentId: [],
    description: { ...emptyDescription },
    additional_description_for_ai_assistant: { ...emptyMiniDescription },
    data: {},
  };

  switch (type) {
    case typeMenuEnum.SETTING_ON_PARAMETER:
      return {
        ...base,
        data: {
          settingOneParameter: {
            address: 0,
            default: 0,
            offset: 0,
            addition: 0,
            unit: "",
            factor: 0,
            minValue: 0,
            maxValue: 0,
            label: lable,
            description: { ...emptyDescription },
            additional_description_for_ai_assistant: {
              ...emptyMiniDescription,
            },
          },
        },
      };

    case typeMenuEnum.SETTING_ON_SELECT:
      return {
        ...base,
        data: {
          settingOneSelect: {
            default: 0,
            address: 0,
            label: lable,
            options: [],
            description: { ...emptyDescription },
            additional_description_for_ai_assistant: {
              ...emptyMiniDescription,
            },
          },
        },
      };

    case typeMenuEnum.SETTING_MULTY_SELECT:
      return {
        ...base,
        data: {
          settingMultySelect: {
            defaults: [],
            addresses: [],
            options: [],
            itemLabels: [],
            description: { ...emptyDescription },
            additional_description_for_ai_assistant: {
              ...emptyMiniDescription,
            },
          },
        },
      };

    case typeMenuEnum.SETTING_MULTY_GROUP:
      return {
        ...base,
        data: {
          settingMultyGroup: [
            {
              settingOneParameter: {
                address: 0,
                default: 0,
                offset: 0,
                addition: 0,
                unit: "",
                factor: 0,
                minValue: 0,
                maxValue: 0,
                label: lable,
                description: { ...emptyDescription },
                additional_description_for_ai_assistant: {
                  ...emptyMiniDescription,
                },
              },
            },
          ],
        },
      };

    default:
      return base;
  }
}

export default function AddMenu({ onSuccess, onCancel, allMenus }: propsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [typeNewMenu, setTypeNewMenu] = React.useState<typeMenuEnum>(
    typeMenuEnum.SUBMENU,
  );
  const [newMenuName, setNewMenuName] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);

  let id: string | null = null;
  for (let i = 0; i < 1000; i++) {
    const founded = allMenus.find((menu) => menu.id == i.toString());
    if (!founded) {
      id = i.toString();
      break;
    }
  }

  const handleSave = async () => {
    if (id == null) return;

    const name = newMenuName.trim();

    if (!name) {
      addMessage("please enter menu name", "error");
      return;
    }

    const newMenu = createEmptyMenu(id, name, typeNewMenu);

    setSaving(true);
    try {
      await API_MENU.post(useMenuStore.getState().endPointMenu, newMenu);
      onSuccess(id);
      onCancel();
    } catch (err) {
      console.log(err);
      addMessage("can not add menu", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={style}>
      <Stack spacing={2}>
        <Typography variant="h6">Add New Menu id : {id}</Typography>

        <TextField
          size="small"
          label="name"
          value={newMenuName}
          onChange={(event) => setNewMenuName(event.target.value)}
        />

        <FormControl size="small">
          <InputLabel id="add-menu-type-label">type</InputLabel>
          <Select
            labelId="add-menu-type-label"
            label="type"
            value={typeNewMenu}
            onChange={(event) =>
              setTypeNewMenu(event.target.value as typeMenuEnum)
            }
          >
            {menuTypeOptions.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel} disabled={saving}>
            cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "saving..." : "add"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
