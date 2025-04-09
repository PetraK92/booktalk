import express from "express";

const port = 8000;

const app = express();

app.get("/api/tasks", (req, res) => {
  const tasks = [
    { id: 1, name: "Task 1", completed: false },
    { id: 2, name: "Task 2", completed: true },
  ];
  res.json(tasks);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
