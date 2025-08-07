"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleTypeLabels = exports.roomTypeLabels = exports.updateProjectSchema = exports.createProjectSchema = exports.designProject = void 0;
const zod_1 = require("zod");
// Design project data model
exports.designProject = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    originalImageUrl: zod_1.z.string(),
    styledImageUrl: zod_1.z.string().optional(),
    roomType: zod_1.z.enum([
        "living-room",
        "bedroom",
        "kitchen",
        "dining-room",
        "bathroom",
        "office",
        "outdoor"
    ]),
    styleType: zod_1.z.enum([
        "modern",
        "scandinavian",
        "industrial",
        "bohemian",
        "traditional",
        "minimalist",
        "farmhouse",
        "mid-century"
    ]),
    status: zod_1.z.enum(["uploading", "processing", "completed", "failed"]),
    createdAt: zod_1.z.date(),
    processingTimeMs: zod_1.z.number().optional(),
});
// Zod schemas for API validation
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    roomType: zod_1.z.enum([
        "living-room",
        "bedroom",
        "kitchen",
        "dining-room",
        "bathroom",
        "office",
        "outdoor"
    ]),
    styleType: zod_1.z.enum([
        "modern",
        "scandinavian",
        "industrial",
        "bohemian",
        "traditional",
        "minimalist",
        "farmhouse",
        "mid-century"
    ]),
});
exports.updateProjectSchema = zod_1.z.object({
    id: zod_1.z.string(),
    styledImageUrl: zod_1.z.string().optional(),
    status: zod_1.z.enum(["uploading", "processing", "completed", "failed"]).optional(),
    processingTimeMs: zod_1.z.number().optional(),
});
// Room type display names
exports.roomTypeLabels = {
    "living-room": "Living Room",
    "bedroom": "Bedroom",
    "kitchen": "Kitchen",
    "dining-room": "Dining Room",
    "bathroom": "Bathroom",
    "office": "Home Office",
    "outdoor": "Outdoor Space"
};
// Style type display names and descriptions
exports.styleTypeLabels = {
    "modern": {
        name: "Modern",
        description: "Clean lines, minimalist furniture, neutral colors"
    },
    "scandinavian": {
        name: "Scandinavian",
        description: "Light woods, cozy textiles, bright and airy feel"
    },
    "industrial": {
        name: "Industrial",
        description: "Raw materials, exposed brick, metal accents"
    },
    "bohemian": {
        name: "Bohemian",
        description: "Rich textures, warm colors, eclectic furniture"
    },
    "traditional": {
        name: "Traditional",
        description: "Classic furniture, elegant details, timeless appeal"
    },
    "minimalist": {
        name: "Minimalist",
        description: "Essential items only, clean spaces, functional design"
    },
    "farmhouse": {
        name: "Farmhouse",
        description: "Rustic charm, natural materials, vintage touches"
    },
    "mid-century": {
        name: "Mid-Century Modern",
        description: "Retro furniture, bold patterns, warm wood tones"
    }
};
