"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  Grid,
  Typography,
  FormControlLabel,
  Box,
} from "@mui/material";

import api from "@/lib/api";
import TaskCard from "@/components/taskCard";
import FilterDrawer from "@/components/filterDrawer";
import AlertModal from "@/components/alertModal";
import PromptBar from "@/components/promptBar";

enum TaskStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [displayAllCheckBoxes, setDisplayAllCheckBoxes] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const response = await api.get("tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const fetchFilteredTasks = async (
    filterStatus: string[],
    filterKeyword: string,
    sortOrder: string
  ) => {
    try {
      const queryParams: string[] = [];

      if (filterStatus.length) {
        queryParams.push(...filterStatus.map((status) => `status=${status}`));
      }

      if (filterKeyword) queryParams.push(`search=${filterKeyword}`);
      if (sortOrder) queryParams.push(`sort=${sortOrder}`);

      const query = queryParams.join("&");
      const response = await api.get(`tasks?${query}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch filtered tasks", error);
    }
  };

  const deleteTask = async () => {
    setAlertModal(false);

    try {
      const responses = await Promise.all(
        selectedTasks.map((id) => api.delete(`/tasks/${id}`))
      );

      const successCount = responses.filter((res) => res.status === 200).length;

      if (successCount === selectedTasks.length) {
        fetchAllTasks();
        setSelectedTasks([]);
        setDisplayAllCheckBoxes(false);
      }
    } catch (error) {
      console.error("Failed to delete tasks", error);
    }
  };

  const handleSelectAllChange = () => {
    setDisplayAllCheckBoxes((prev) => {
      const newValue = !prev;
      setSelectedTasks(newValue ? tasks.map((task) => task.id) : []);
      return newValue;
    });
  };

  return (
    <Box textAlign="center" sx={{ px: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Tasks
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} mb={2}>
        <Button
          variant="contained"
          onClick={() => router.push("/tasks/createTask")}
          sx={{ width: "9rem" }}
        >
          Create Task
        </Button>
        <Button
          variant="contained"
          onClick={() => setAlertModal(true)}
          sx={{ width: "9rem" }}
          disabled={selectedTasks.length === 0}
        >
          Delete Tasks
        </Button>
        <Button
          variant="contained"
          onClick={() => setToggleDrawer(true)}
          sx={{ width: "9rem" }}
          disabled={tasks.length == 0}
        >
          Filters
        </Button>
      </Box>

      {tasks.length > 0 ? (
        <>
          <Box display="flex" alignItems="center" sx={{ ml: 3, mb: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={displayAllCheckBoxes}
                  onChange={handleSelectAllChange}
                />
              }
              label="Select All Tasks"
            />
          </Box>
          <Grid container spacing={3} sx={{ px: 3, mb: 12 }}>
            {tasks.map((task) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
                <TaskCard
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  select={displayAllCheckBoxes}
                  setSelectedTasks={setSelectedTasks}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : <Typography variant="h5" style={{marginTop: '10%'}}>Create a task to start</Typography>}

      <PromptBar refreshPage={fetchAllTasks}/>

      <FilterDrawer
        open={toggleDrawer}
        onClose={() => setToggleDrawer(false)}
        applyFilter={fetchFilteredTasks}
        removeFilter={fetchAllTasks}
      />

      <AlertModal
        title=""
        contentText="Are you sure you want to delete the selected tasks?"
        open={alertModal}
        yesText="Yes"
        noText="No"
        handleYes={deleteTask}
        handleClose={() => setAlertModal(false)}
      />
    </Box>
  );
}
