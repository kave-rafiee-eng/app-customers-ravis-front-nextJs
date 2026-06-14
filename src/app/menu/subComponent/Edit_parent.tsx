import * as React from "react";
import {
  Autocomplete,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMenuStore } from "../store/menu_store";
import { menuType, typeMenuEnum } from "../type/menu_type";
import { TableBasic } from "../../tree/component/TableBasic";
import { useSnackBarError } from "../../stors/snakebar-store";

type propsType = {
  // currentMenuId: string;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EditParent({}: propsType) {
  const parent = useMenuStore((state) => state.parent);
  const setParent = useMenuStore((state) => state.setParent);
  const allMenus = useMenuStore((state) => state.allMenus);
  const addMessage = useSnackBarError((state) => state.addMessage);

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<menuType | null>(null);
  const [label, setLabel] = React.useState<string>("");

  const currentMenuId = useMenuStore((state) => state.currentMenuId);

  const submenuCandidates = React.useMemo(() => {
    const parentIds = new Set(parent.map((p) => p.id));
    return allMenus.filter(
      (menu) =>
        menu.type === typeMenuEnum.SUBMENU &&
        menu.id !== currentMenuId &&
        !parentIds.has(menu.id),
    );
  }, [allMenus, currentMenuId, parent]);

  const handleOpenModal = () => {
    setSelectedMenu(null);
    setOpenModal(true);
    fineMenuName;
    const founded = allMenus.find((menu) => menu.id == currentMenuId);
    if (founded) {
      setLabel(founded.lable!);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMenu(null);
  };

  const handleAddParent = () => {
    if (!selectedMenu) {
      addMessage("please select a submenu", "error");
      return;
    }

    if (parent.some((p) => p.id === selectedMenu.id)) {
      addMessage("this parent is already added", "error");
      return;
    }

    setParent([
      ...parent,
      {
        id: selectedMenu.id,
        label: label,
      },
    ]);
    handleCloseModal();
  };

  const handleDeleteParent = (id: string) => {
    setParent(parent.filter((p) => p.id !== id));
  };

  const getMenuLabel = (menu: menuType) =>
    `${menu.lable ?? menu.id} (${menu.id})`;

  const fineMenuName = (id: string): string => {
    const founded = allMenus.find((menu) => menu.id == id);
    if (founded) return founded.lable!;
    return "not found";
  };
  return (
    <>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Parents</Typography>
          <Button variant="contained" size="small" onClick={handleOpenModal}>
            add parent
          </Button>
        </Stack>

        <TableBasic
          columns={[
            { id: "id", label: "id" },
            { id: "label", label: "label" },
            { id: "action", label: "action" },
          ]}
          tableData={parent.map((value) => ({
            id: `${fineMenuName(value.id)} ( ${value.id} )`,
            label: value.label,
            action: (
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteParent(value.id)}
              >
                <DeleteIcon />
              </IconButton>
            ),
          }))}
        />
      </Stack>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Stack spacing={2} sx={style}>
          <Typography variant="h6">Add Parent (Submenu)</Typography>

          <TextField
            size="small"
            label="label"
            value={label}
            onChange={(event) => {
              setLabel(event.target.value);
            }}
          />

          <Autocomplete
            options={submenuCandidates}
            value={selectedMenu}
            onChange={(_, value) => setSelectedMenu(value)}
            getOptionLabel={getMenuLabel}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(options, { inputValue }) => {
              const query = inputValue.trim().toLowerCase();
              if (!query) return options;
              return options.filter(
                (menu) =>
                  menu.id.toLowerCase().includes(query) ||
                  (menu.lable ?? "").toLowerCase().includes(query),
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="search submenu"
                placeholder="search by id or label"
                size="small"
              />
            )}
            noOptionsText="no submenu found"
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCloseModal}>
              cancel
            </Button>
            <Button variant="contained" onClick={handleAddParent}>
              add
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}
