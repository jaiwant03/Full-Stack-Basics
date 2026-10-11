const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const studentsFile = path.join(__dirname, "data", "students.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readStudents() {
  const students = JSON.parse(fs.readFileSync(studentsFile, "utf8"));

  if (!Array.isArray(students)) {
    throw new TypeError("Student data must be a JSON array.");
  }

  return students;
}

app.get("/api/status", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Student API is running",
    server: "Node.js + Express",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/students", (req, res) => {
  try {
    res.status(200).json(readStudents());
  } catch (error) {
    console.error("Error reading student data:", error.message);
    res.status(500).json({ message: "Unable to load student data" });
  }
});

app.get("/api/students/:id", (req, res) => {
  const idText = req.params.id;

  if (!/^\d+$/.test(idText) || !Number.isSafeInteger(Number(idText))) {
    return res.status(400).json({ message: "Student ID must be a number" });
  }

  try {
    const student = readStudents().find((record) => record.id === Number(idText));

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Error reading student data:", error.message);
    return res.status(500).json({ message: "Unable to load student data" });
  }
});

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Student API is running at http://localhost:${PORT}`);
});
