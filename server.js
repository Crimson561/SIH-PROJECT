const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({
    message: "SIH Backend is working!",
  });
});
app.get("/api/trains", (req, res) => {
  const trains = [
    {
      id: "TR-101",
      number: "12901",
      name: "Intercity Express",
      color: "blue",
      status: "Running on time",
      direction: "Toward Amritsar",
      lastStation: "Jalandhar",
      nextStation: "Phagwara",
      scheduledArrival: "20:35",
      etaNext: "20:35",
      delay: 0,
      positionKm: 82,
      timetable: [
        {
          station: "Ludhiana",
          scheduled: "19:30",
          estimated: "19:30",
          status: "departed",
        },
        {
          station: "Phagwara",
          scheduled: "20:35",
          estimated: "20:35",
          status: "on-time",
        },
        {
          station: "Jalandhar",
          scheduled: "21:05",
          estimated: "21:05",
          status: "on-time",
        },
      ],
    },
    {
      id: "TR-204",
      number: "12030",
      name: "Shatabdi Express",
      color: "red",
      status: "Running late",
      direction: "Toward Ludhiana",
      lastStation: "Phagwara",
      nextStation: "Ludhiana",
      scheduledArrival: "20:20",
      etaNext: "20:28",
      delay: 8,
      positionKm: 125,
      timetable: [
        {
          station: "Amritsar",
          scheduled: "18:30",
          estimated: "18:30",
          status: "departed",
        },
        {
          station: "Phagwara",
          scheduled: "20:20",
          estimated: "20:28",
          status: "delayed",
        },
        {
          station: "Ludhiana",
          scheduled: "21:00",
          estimated: "21:08",
          status: "delayed",
        },
      ],
    },
  ];

  res.json(trains);
});
// In-memory maintenance tasks store (resets when the server restarts)
let maintenanceTasks = [
    {
      id: "TMS-3001",
      workType: "Track Inspection",
      department: "Engineering",
      corridor: "Jalandhar Cantt–Phagwara",
      location: "KM 104",
      priority: "High",
      estimatedDuration: 90,
      overdueDays: 2,
      status: "Pending",
      description: "Routine inspection of track condition and alignment.",
      assetId: "TRK-104",
      lastMaintenance: "2026-08-28",
      assignedTeam: "Track Maintenance Team A",
      compatibilityGroup: "TRACK",
    },
    {
      id: "TMS-3002",
      workType: "Signal Maintenance",
      department: "S&T",
      corridor: "Beas–Jalandhar",
      location: "KM 82",
      priority: "Critical",
      estimatedDuration: 120,
      overdueDays: 0,
      status: "Scheduled",
      description: "Inspection and maintenance of signalling equipment.",
      assetId: "SIG-082",
      lastMaintenance: "2026-09-05",
      assignedTeam: "S&T Team B",
      compatibilityGroup: "SIGNAL",
    },
    {
      id: "TMS-3003",
      workType: "OHE Inspection",
      department: "Traction/OHE",
      corridor: "Phagwara–Ludhiana",
      location: "KM 136",
      priority: "Medium",
      estimatedDuration: 60,
      overdueDays: 5,
      status: "Completed",
      description:
        "Inspection of overhead equipment and supporting components.",
      assetId: "OHE-136",
      lastMaintenance: "2026-09-10",
      assignedTeam: "OHE Team A",
      compatibilityGroup: "OHE",
    },
  ];

// GET all maintenance tasks
app.get("/api/maintenance", (req, res) => {
  res.json(maintenanceTasks);
});

// POST a new maintenance task
app.post("/api/maintenance", (req, res) => {
  const newTask = req.body;

  if (!newTask || !newTask.id || !newTask.workType) {
    return res.status(400).json({ error: "Task must include at least an id and workType." });
  }

  maintenanceTasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH (update) an existing maintenance task, e.g. { status: "Completed" }
app.patch("/api/maintenance/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const task = maintenanceTasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Maintenance task ${id} not found.` });
  }

  Object.assign(task, updates);
  res.json(task);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
