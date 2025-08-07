import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";

export async function registerRoutes(app) {
  // Serve static files
  app.use("/uploads", express.static("uploads"));
  
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
  }

  // Health check
  app.get("/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      message: "AI Interior Design Platform API",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  // Root route
  app.get('/', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      const indexPath = path.resolve('dist', 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.json({ 
          status: "healthy", 
          message: "AI Interior Design Platform API",
          timestamp: new Date().toISOString(),
          version: "1.0.0"
        });
      }
    } else {
      res.json({ 
        status: "healthy", 
        message: "AI Interior Design Platform API - Development Mode",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}