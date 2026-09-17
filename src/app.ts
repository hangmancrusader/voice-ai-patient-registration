import express from "express";
import cors from "cors";
import patientsRouter from "./routes/patients.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/patients", patientsRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Voice AI Patient Registration API is running"
  });
});

export default app;