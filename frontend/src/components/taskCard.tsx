import { useRouter } from "next/navigation";
import styles from "./taskCard.module.css";
import { Card, Checkbox } from "@mui/material";
import { useState } from "react";

type TaskData = {
  id: string;
  title: string;
  description: string;
  status: string;
  select: boolean;
  setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TaskCard({
  id,
  title,
  description,
  status,
  select,
  setSelectedTasks,
}: TaskData) {
  const router = useRouter();

  const [toggleCheckBox, setToggleCheckbox] = useState(false);

  const handleClick = () => {
    router.push(`/tasks/${id}`);
  };

  return (
    <Card
      className={styles.taskCard}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleClick();
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: 0,
          paddingBottom: 0,
        }}
      >
        <Checkbox
          style={{ margin: 0, paddingBottom: 0 }}
          checked={select || toggleCheckBox}
          key={id}
          value={id}
          onChange={() => {
            setToggleCheckbox((prev) => !prev);
            setSelectedTasks((prev) =>
              prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
            );
          }}
          onClick={(e) => e.stopPropagation()} // Prevent card click
        />
      </div>

      <h3 style={{ margin: 0, paddingTop: 0 }}>{title}</h3>
      <p
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        {description}
      </p>
      <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>
        {status}
      </span>
    </Card>
  );
}
