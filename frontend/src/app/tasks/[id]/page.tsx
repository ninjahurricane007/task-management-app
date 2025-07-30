"use client";

import styles from "./taskDetails.module.css";
import api from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@mui/material/Button";
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import AlertModal from "@/components/alertModal";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function TaskDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
  }

  type Task = {
    title: string;
    description: string;
    status: TaskStatus;
  };

  const [task, setTask] = useState<Task | null>(null);
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(TaskStatus.IN_PROGRESS);
  const [isUpdated, setIsUpdated] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [alertModal, setAlertModal] = useState(false)
  const oldStatus = useRef<TaskStatus | null>(null) // to persist the value across renders and updates

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
        oldStatus.current = response.data.status
        setCurrentStatus(response.data.status)
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [id]);

  const updateStatus = async () => {
    const response = await api.patch(
      `/tasks/${id}/status`,
      { status: currentStatus },
    );
    if(response.status == 200){
      setIsUpdated(true)
      oldStatus.current = response.data.status
    }
    setTimeout(()=>{
      setIsUpdated(false)
    }, 3000)
    if (currentStatus === "DONE") celebrate()
    console.log("response", response);
  };

  const deleteTask = async () => {
    setAlertModal(false)
    const response = await api.delete(`/tasks/${id}`);
    if(response.status == 200){
      setIsDeleted(true)
    }
    setTimeout(()=>{
      setIsDeleted(false)
      router.push('/tasks')
    }, 3000)
    console.log("response", response);
  };

  const handleClose = () => {
    setAlertModal(false)
  }

  const handleStatusChange = (event: SelectChangeEvent<TaskStatus>) => {
    setCurrentStatus(event.target.value as TaskStatus);
  };

  const celebrate = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

  return (
    <div className={styles.taskDetails}>
      <h3>{task?.title}</h3>
      <p>{task?.description}</p>
      <br></br>
      <FormControl variant="outlined">
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          id="status"
          value={currentStatus}
          label="Status"
          onChange={handleStatusChange}
        >
          <MenuItem value={TaskStatus.OPEN}>Open</MenuItem>
          <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
          <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
        </Select>
      </FormControl>
      <br></br>
      <br></br>
      <Button
        variant="contained"
        onClick={() => {
          updateStatus();
        }}
        disabled={oldStatus.current == currentStatus}
      >
        Update
      </Button>{" "}
      <Button
        variant="contained"
        onClick={() => {
          setAlertModal(true)
        }}
      >
        Delete
      </Button>
      <br></br>
      {isUpdated && 
      <Box sx={{ width: '25%', mx: 'auto', marginTop: '50px' }}>
        <Alert 
        severity="success" 
        onClose={() => {setIsUpdated(false)}}
        >
          Status updated successfully.
        </Alert>
      </Box>
      }
      {isDeleted && 
      <Box sx={{ width: '25%', mx: 'auto', marginTop: '50px' }}>
        <Alert 
        severity="success" 
        onClose={() => {setIsDeleted(false)}}
        >
          Task deleted successfully. Redirecting to tasks page... 
        </Alert>
      </Box>
      }

      <AlertModal
        title=""
        contentText="Are you sure you want to delete this task?"
        open={alertModal}
        yesText="Yes"
        noText="No"
        handleYes={deleteTask}
        handleClose={handleClose}
      ></AlertModal>
    </div>    
  );
}
