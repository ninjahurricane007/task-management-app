import { Box, Button, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CircularProgress from "@mui/material/CircularProgress";
import api from "@/lib/api";

type TaskData = {
  title: string;
  description: string;
};

type PromptBarProps = {
  refreshPage: () => void;
  allTasks: TaskData[];
};

export default function PromptBar({ refreshPage, allTasks }: PromptBarProps) {
  console.log("allTasks", allTasks);
  const placeholderValues = [
    "Type your prompt to generate task",
    "Eg: Create a task for implementing login functionality",
    "Eg: Watch cricket match at 7:00 pm",
  ];
  const [prompt, setPrompt] = useState<string>("");
  const [index, setIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState<string>(placeholderValues[0]);
  const [showProgressIcon, setShowProgressIcon] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (index === placeholderValues.length) {
        setIndex(0);
        setPlaceholder(placeholderValues[0]);
      } else {
        setIndex(index + 1);
        setPlaceholder(placeholderValues[index]);
      }
    }, 3000);
  });

  const handleGenerateTask = async (prompt: string) => {
    try {
      setShowProgressIcon(true);
      const { data } = await api.post("/tasks/generate-from-prompt", {
        prompt,
      });

      const similarityResults = await Promise.all(
        allTasks.map((task) =>
          api.post("/tasks/check-similarity", {
            text1: task.title,
            text2: data.title,
          })
        )
      );

      const similarities = similarityResults.map((res) => res.data);
      const maxSimilarity = Math.max(...similarities);

      if (maxSimilarity > 0.8) {
        console.log("A similar task already exists");
      } else {
        await api.post("/tasks", {
          title: data.title,
          description: data.description,
        });
        refreshPage();
      }

      setShowProgressIcon(false);
      setPrompt("");
    } catch (error) {
      console.error("Failed to generate task:", error);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "85%", sm: "75%", md: "65%" },
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.15)",
        borderRadius: "25px",
        py: 2,
        px: 2,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        <TextField
          variant="outlined"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (prompt) {
                handleGenerateTask(prompt);
              }
            }
          }}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {showProgressIcon ? (
                  <CircularProgress color="inherit" size="1.25rem" />
                ) : (
                  <AutoFixHighIcon sx={{ opacity: "75%" }} />
                )}
              </InputAdornment>
            ),
            sx: {
              height: "40px",
              borderRadius: "12px",
              fontSize: "0.9rem",
            },
            inputProps: {
              style: {
                padding: "8px 14px",
              },
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            borderRadius: "12px",
            px: 3,
            height: "100%",
            whiteSpace: "nowrap",
          }}
          onClick={() => {
            if (prompt) {
              handleGenerateTask(prompt);
            }
          }}
        >
          Generate
        </Button>
      </Box>
    </Box>
  );
}
