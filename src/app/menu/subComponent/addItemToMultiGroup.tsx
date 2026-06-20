import {
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
import {
  menuType,
  settingMultyGroupType,
  typeMenuEnum,
} from "../type/menu_type";
import { styleModal } from "../style";
import { useSnackBarError } from "@/app/stors/snakebar-store";
import React from "react";
import { checkTypeMenu } from "../type/checkTypeMenu";
import { emptyDescription, emptyMiniDescription } from "../store/menu_store";

enum itemEnum {
  onSelect = "onSelect",
  onParameter = "onParameter",
}
type propsType = {
  onSuccess: () => void;
  onCancel: () => void;
  menu: menuType;
  setMenuState: React.Dispatch<React.SetStateAction<menuType | null>>;
};
export default function AddItemToMultyGroup({
  onCancel,
  onSuccess,
  menu,
  setMenuState,
}: propsType) {
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [itemName, setItemName] = React.useState("");
  const [itemType, setItemType] = React.useState<itemEnum>(itemEnum.onSelect);

  const handleSave = () => {
    const name = itemName.trim();
    if (name.length < 2) {
      addMessage("name length < 2 ", "error");
      return;
    }

    if (checkTypeMenu(menu) != typeMenuEnum.SETTING_MULTY_GROUP) {
      addMessage("unsupported menu type", "error");
      return;
    }

    setMenuState((prev) => {
      if (!prev || checkTypeMenu(prev) != typeMenuEnum.SETTING_MULTY_GROUP) {
        return prev;
      }

      return {
        ...prev,
        data: {
          ...prev.data,
          settingMultyGroup: [
            ...(prev.data.settingMultyGroup ?? []),
            createEmptyGroupItem(itemType, name),
          ],
        },
      };
    });
    onSuccess();
    onCancel();
  };
  return (
    <Box sx={styleModal}>
      <Stack spacing={2}>
        <Typography variant="h6">Add new item</Typography>

        <TextField
          size="small"
          label="name"
          value={itemName}
          onChange={(event) => setItemName(event.target.value)}
        />

        <FormControl size="small">
          <InputLabel id="add-menu-type-label">type</InputLabel>
          <Select
            labelId="add-menu-type-label"
            label="type"
            value={itemType}
            onChange={(event) => setItemType(event.target.value as itemEnum)}
          >
            {Object.values(itemEnum).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel}>
            cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            add
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function createEmptyGroupItem(
  type: itemEnum,
  label: string,
): settingMultyGroupType {
  if (type == itemEnum.onSelect) {
    return {
      settingOneSelect: {
        default: 0,
        address: 0,
        label,
        options: [],
        description: { ...emptyDescription },
        additional_description_for_ai_assistant: { ...emptyMiniDescription },
      },
    };
  }

  return {
    settingOneParameter: {
      address: 0,
      default: 0,
      offset: 0,
      addition: 0,
      unit: "",
      factor: 0,
      minValue: 0,
      maxValue: 0,
      label,
      description: { ...emptyDescription },
      additional_description_for_ai_assistant: { ...emptyMiniDescription },
    },
  };
}
