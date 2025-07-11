import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

type TaskFilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  applyFilter: (
    filterStatus: string[],
    filterKeyword: string,
    sortOrder: string
  ) => void;
  removeFilter: () => void;
};

const statusOptions = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

const sortOptions = [
  "Created First",
  "Created Last",
  "Modified First",
  "Modified Last",
];

export default function FilterDrawer({
  open,
  onClose,
  applyFilter,
  removeFilter,
}: TaskFilterDrawerProps) {
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([
    "OPEN",
    "IN_PROGRESS",
    "DONE",
  ]);
  const [sortOrder, setSortOrder] = useState("");

  const handleStatusChange = (value: string, checked: boolean) => {
    setFilterStatus((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleClear = () => {
    setFilterKeyword("");
    setFilterStatus([
      "OPEN",
      "IN_PROGRESS",
      "DONE",
    ]);
    setSortOrder("");
    removeFilter();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 3 }} role="presentation">
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>

        <Box mb={2}>
          <Typography variant="subtitle1">Search by Keyword</Typography>
          <TextField
            fullWidth
            placeholder="Enter keyword"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            size="small"
            style={{marginTop: 10, marginBottom: 15}}
          />
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1">Filter by Status</Typography>
          <FormGroup>
            {statusOptions.map((status) => {
              const isOnlyOneChecked =
                filterStatus.length === 1 &&
                filterStatus.includes(status.value);

              return (
                <FormControlLabel
                  key={status.value}
                  control={
                    <Checkbox
                      checked={filterStatus.includes(status.value)}
                      disabled={isOnlyOneChecked}
                      onChange={(e) =>
                        handleStatusChange(status.value, e.target.checked)
                      }
                    />
                  }
                  label={status.label}
                />
              );
            })}
          </FormGroup>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1">Sort By</Typography>
          <RadioGroup
            name="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            {sortOptions.map((sort) => (
              <FormControlLabel
                key={sort}
                value={sort}
                control={<Radio />}
                label={sort}
              />
            ))}
          </RadioGroup>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() =>
              applyFilter(filterStatus, filterKeyword, sortOrder)
            }
          >
            Apply
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
