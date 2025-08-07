"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const http_1 = require("http");
const storage_1 = require("./storage");
const aiService_1 = require("./aiService");
const schema_1 = require("../shared/schema");
const path_1 = __importDefault(require("path"));
const storage = new storage_1.MemStorage();
const aiService = new aiService_1.AIDesignService();
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
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
async function registerRoutes(app) {
    // Serve uploaded images statically
    app.use("/uploads", express_1.default.static("uploads"));
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
            const result = schema_1.createProjectSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({ error: result.error.issues });
            }
            // Process and save the uploaded image
            const processedImage = await (0, sharp_1.default)(req.file.buffer)
                .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();
            // Create filename and save
            const filename = `original-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
            const fs = await Promise.resolve().then(() => __importStar(require("fs/promises")));
            await fs.mkdir("uploads", { recursive: true });
            await fs.writeFile(path_1.default.join("uploads", filename), processedImage);
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
            const result = schema_1.updateProjectSchema.safeParse({
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
    const httpServer = (0, http_1.createServer)(app);
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
            styledImageUrl = await aiService.mockGenerateStyledRoom();
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
