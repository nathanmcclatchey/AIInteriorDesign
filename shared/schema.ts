import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Design project data model
export const designProject = z.object({
  id: z.string(),
  title: z.string(),
  originalImageUrl: z.string(),
  styledImageUrl: z.string().optional(),
  roomType: z.enum([
    "living-room", 
    "bedroom", 
    "kitchen", 
    "dining-room", 
    "bathroom", 
    "office", 
    "outdoor"
  ]),
  styleType: z.enum([
    "modern",
    "scandinavian", 
    "industrial",
    "bohemian",
    "traditional",
    "minimalist",
    "farmhouse",
    "mid-century"
  ]),
  status: z.enum(["uploading", "processing", "completed", "failed"]),
  createdAt: z.date(),
  processingTimeMs: z.number().optional(),
});

// Zod schemas for API validation
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  roomType: z.enum([
    "living-room", 
    "bedroom", 
    "kitchen", 
    "dining-room", 
    "bathroom", 
    "office", 
    "outdoor"
  ]),
  styleType: z.enum([
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

export const updateProjectSchema = z.object({
  id: z.string(),
  styledImageUrl: z.string().optional(),
  status: z.enum(["uploading", "processing", "completed", "failed"]).optional(),
  processingTimeMs: z.number().optional(),
});

// Type definitions
export type DesignProject = z.infer<typeof designProject>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// Room type display names
export const roomTypeLabels: Record<DesignProject['roomType'], string> = {
  "living-room": "Living Room",
  "bedroom": "Bedroom", 
  "kitchen": "Kitchen",
  "dining-room": "Dining Room",
  "bathroom": "Bathroom",
  "office": "Home Office",
  "outdoor": "Outdoor Space"
};

// Style type display names and descriptions
export const styleTypeLabels: Record<DesignProject['styleType'], { name: string; description: string }> = {
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