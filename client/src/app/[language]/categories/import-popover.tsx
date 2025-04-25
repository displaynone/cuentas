import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

type ImportPopoverProps = {
  open: boolean;
  onClose: () => void;
  columns: string[];
  onSave: (columns: ColumnsReference) => void;
};

const ColumnKeys = [
  "id",
  "balance",
  "amount",
  "reference",
  "description",
  "concept",
  "date",
] as const;
type ColumnKey = (typeof ColumnKeys)[number];

export type ColumnsReference = Record<ColumnKey, number | undefined>;

const ImportPopover: React.FC<ImportPopoverProps> = ({
  open,
  onClose,
  columns,
  onSave,
}) => {
  const [data, setData] = useState<ColumnsReference>({
    amount: undefined,
    balance: undefined,
    concept: undefined,
    date: undefined,
    description: undefined,
    id: undefined,
    reference: undefined,
  });

  const handleColumnChange = (key: string, value: number) =>
    setData({
      ...data,
      [key]: value,
    });

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Match Columns</DialogTitle>
      <DialogContent>
        {ColumnKeys.map((key) => (
          <FormControl key={key} fullWidth margin="normal">
            <InputLabel>{key}</InputLabel>
            <Select<number>
              value={data[key]}
              onChange={(event: SelectChangeEvent<number>) =>
                handleColumnChange(key, +event.target.value)
              }
            >
              {columns.map((column, key) => (
                <MenuItem key={key} value={key}>
                  {column}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportPopover;
