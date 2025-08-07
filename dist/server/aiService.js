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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIDesignService = void 0;
class AIDesignService {
    constructor() {
        this.openai = null;
        // Only initialize OpenAI if API key is available
        if (process.env.OPENAI_API_KEY) {
            try {
                // Dynamic import to avoid dependency issues
                this.initializeOpenAI();
            }
            catch (error) {
                console.log("OpenAI not available, using mock service");
            }
        }
    }
    async initializeOpenAI() {
        try {
            const OpenAI = await Promise.resolve().then(() => __importStar(require("openai")));
            this.openai = new OpenAI.default({
                apiKey: process.env.OPENAI_API_KEY,
            });
        }
        catch (error) {
            console.log("OpenAI package not found, using mock service");
        }
    }
    async generateStyledRoom(originalImageBase64, roomType, styleType) {
        // Use real OpenAI if available, otherwise use mock
        if (this.openai) {
            return this.generateWithOpenAI(originalImageBase64, roomType, styleType);
        }
        else {
            return this.mockGenerateStyledRoom(roomType, styleType);
        }
    }
    async generateWithOpenAI(originalImageBase64, roomType, styleType) {
        try {
            // Generate a detailed prompt for the AI based on room and style type
            const prompt = this.createPrompt(roomType, styleType);
            // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt,
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${originalImageBase64}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 4000,
            });
            // For now, we'll use DALL-E to generate a styled room image
            // In a real implementation, this would be more sophisticated
            const imageResponse = await this.openai.images.generate({
                model: "dall-e-3",
                prompt: this.createImagePrompt(roomType, styleType),
                n: 1,
                size: "1024x1024",
                quality: "hd",
            });
            return imageResponse.data[0].url;
        }
        catch (error) {
            console.error("AI service error:", error);
            throw new Error("Failed to generate styled room image");
        }
    }
    createPrompt(roomType, styleType) {
        const roomName = roomType.replace("-", " ");
        return `Analyze this ${roomName} image and provide detailed styling recommendations for a ${styleType} design. Consider the room's dimensions, lighting, architectural features, and suggest specific furniture pieces, color schemes, and decor elements that would transform this space into a beautifully designed ${styleType} ${roomName}.`;
    }
    createImagePrompt(roomType, styleType) {
        const roomName = roomType.replace("-", " ");
        const styleDescriptions = {
            modern: "clean lines, minimalist furniture, neutral colors, sleek surfaces",
            scandinavian: "light wood furniture, cozy textiles, white walls, natural light",
            industrial: "exposed brick, metal fixtures, leather furniture, concrete floors",
            bohemian: "colorful textiles, plants, eclectic furniture, warm lighting",
            traditional: "classic furniture, elegant fabrics, warm colors, formal layout",
            minimalist: "very few items, white and beige colors, simple furniture, clean space",
            farmhouse: "rustic wood, vintage furniture, natural materials, cozy atmosphere",
            "mid-century": "retro furniture, bold colors, geometric patterns, warm wood"
        };
        return `A beautifully designed ${styleType} ${roomName} interior with ${styleDescriptions[styleType] || 'stylish furniture and decor'}. Professional interior design photography, high quality, realistic lighting, 4K resolution.`;
    }
    // Mock function for development - generates a placeholder styled image
    async mockGenerateStyledRoom(roomType, styleType) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Return different placeholder images based on room and style type
        const roomImages = {
            "living-room": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
            "bedroom": "https://images.unsplash.com/photo-1540518614846-7eded47432f5",
            "kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
            "dining-room": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
            "bathroom": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
            "office": "https://images.unsplash.com/photo-1497366216548-37526070297c",
            "outdoor": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b"
        };
        return `${roomImages[roomType]}?w=800&h=600&fit=crop`;
    }
}
exports.AIDesignService = AIDesignService;
