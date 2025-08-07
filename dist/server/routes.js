import express from "express";
import multer from "multer";
import sharp from "sharp";
import { createServer } from "http";
import { MemStorage } from "./storage.js";
import { AIDesignService } from "./aiService.js";
import { createProjectSchema, updateProjectSchema } from "../shared/schema.js";
import path from "path";
import fs from "fs";
const storage = new MemStorage();
const aiService = new AIDesignService();
// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    },
});
export async function registerRoutes(app) {
    // Serve uploaded images statically
    app.use("/uploads", express.static("uploads"));
    // Serve static frontend files in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('dist'));
    }
    // Health check endpoint for deployment
    app.get("/health", (req, res) => {
        res.json({
            status: "healthy",
            message: "AI Interior Design Platform API",
            timestamp: new Date().toISOString(),
            version: "1.0.0"
        });
    });
    // Get all design projects
    app.get("/api/projects", async (req, res) => {
        try {
            const projects = await storage.getAllProjects();
            res.json(projects);
        }
        catch (error) {
            console.error("Error fetching projects:", error);
            res.status(500).json({ error: "Failed to fetch projects" });
        }
    });
    // Get single project
    app.get("/api/projects/:id", async (req, res) => {
        try {
            const project = await storage.getProject(req.params.id);
            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }
            res.json(project);
        }
        catch (error) {
            console.error("Error fetching project:", error);
            res.status(500).json({ error: "Failed to fetch project" });
        }
    });
    // Create new project with image upload
    app.post("/api/projects", upload.single("image"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "Image file is required" });
            }
            // Validate form data
            const result = createProjectSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({ error: result.error.issues });
            }
            // Process and save the uploaded image
            const processedImage = await sharp(req.file.buffer)
                .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();
            // Create filename and save
            const filename = `original-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
            const fs = await import("fs/promises");
            await fs.mkdir("uploads", { recursive: true });
            await fs.writeFile(path.join("uploads", filename), processedImage);
            const originalImageUrl = `/uploads/${filename}`;
            // Create project in storage
            const project = await storage.createProject({
                ...result.data,
                originalImageUrl,
            });
            res.json(project);
            // Start AI processing in background
            processProjectAsync(project.id, processedImage, result.data.roomType, result.data.styleType);
        }
        catch (error) {
            console.error("Error creating project:", error);
            res.status(500).json({ error: "Failed to create project" });
        }
    });
    // Update project
    app.put("/api/projects/:id", async (req, res) => {
        try {
            const result = updateProjectSchema.safeParse({
                ...req.body,
                id: req.params.id,
            });
            if (!result.success) {
                return res.status(400).json({ error: result.error.issues });
            }
            const project = await storage.updateProject(result.data);
            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }
            res.json(project);
        }
        catch (error) {
            console.error("Error updating project:", error);
            res.status(500).json({ error: "Failed to update project" });
        }
    });
    // Delete project
    app.delete("/api/projects/:id", async (req, res) => {
        try {
            const success = await storage.deleteProject(req.params.id);
            if (!success) {
                return res.status(404).json({ error: "Project not found" });
            }
            res.json({ success: true });
        }
        catch (error) {
            console.error("Error deleting project:", error);
            res.status(500).json({ error: "Failed to delete project" });
        }
    });
    // Root endpoint for deployment health checks and React app in production
    app.get('/', (req, res) => {
        // If in production and index.html exists, serve React app
        if (process.env.NODE_ENV === 'production') {
            const indexPath = path.resolve('dist', 'index.html');
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            }
            else {
                // Fallback health check if no build exists
                res.json({
                    status: "healthy",
                    message: "AI Interior Design Platform API",
                    timestamp: new Date().toISOString(),
                    version: "1.0.0"
                });
            }
        }
        else {
            // Development mode - return API status
            res.json({
                status: "healthy",
                message: "AI Interior Design Platform API - Development Mode",
                timestamp: new Date().toISOString(),
                version: "1.0.0"
            });
        }
    });
    // Serve React app for known frontend routes in production
    if (process.env.NODE_ENV === 'production') {
        // Handle specific frontend routes to avoid wildcard issues
        const frontendRoutes = ['/gallery', '/design', '/about', '/projects'];
        frontendRoutes.forEach(route => {
            app.get(route, (req, res) => {
                res.sendFile(path.resolve('dist', 'index.html'));
            });
        });
    }
    const httpServer = createServer(app);
    return httpServer;
}
// Background processing function
async function processProjectAsync(projectId, imageBuffer, roomType, styleType) {
    try {
        const startTime = Date.now();
        // Update project status to processing
        await storage.updateProject({
            id: projectId,
            status: "processing",
        });
        // Convert image to base64 for AI processing
        const base64Image = imageBuffer.toString("base64");
        // Check if OPENAI_API_KEY is available
        let styledImageUrl;
        if (process.env.OPENAI_API_KEY) {
            // Use real AI service
            styledImageUrl = await aiService.generateStyledRoom(base64Image, roomType, styleType);
        }
        else {
            // Use mock service for development
            console.log("Using mock AI service - OPENAI_API_KEY not found");
            styledImageUrl = await aiService.mockGenerateStyledRoom(roomType, styleType);
        }
        const processingTime = Date.now() - startTime;
        // Update project with results
        await storage.updateProject({
            id: projectId,
            status: "completed",
            styledImageUrl,
            processingTimeMs: processingTime,
        });
    }
    catch (error) {
        console.error("Error processing project:", error);
        // Mark project as failed
        await storage.updateProject({
            id: projectId,
            status: "failed",
        });
    }
}
