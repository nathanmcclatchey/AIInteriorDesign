import express from "express";
import cors from "cors";
import { registerRoutes } from "./simple-routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const server = await registerRoutes(app);
    
    server.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();