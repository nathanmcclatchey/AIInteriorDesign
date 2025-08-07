// Minimal test server to identify the issue
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// Basic health check
app.get("/", (req, res) => {
  res.json({ 
    status: "healthy", 
    message: "Test server running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    message: "Test server health check",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Test server running on port ${PORT}`);
});