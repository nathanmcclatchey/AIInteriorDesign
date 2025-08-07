// CommonJS OpenAI integration to avoid module conflicts

class OpenAIService {
  constructor() {
    this.openai = null;
    this.initialized = false;
    this.initializeOpenAI();
  }

  async initializeOpenAI() {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.log('❌ OPENAI_API_KEY not found, using mock service');
        return;
      }

      // Use fetch-based OpenAI API calls instead of SDK to avoid dependency issues
      this.openai = {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: 'https://api.openai.com/v1'
      };
      this.initialized = true;
      console.log('✅ OpenAI service initialized with real API (fetch-based)');
      
    } catch (error) {
      console.log('❌ OpenAI initialization failed, using mock service:', error.message);
    }
  }

  async generateStyledRoom(originalImageBase64, roomType, styleType) {
    if (this.initialized && this.openai) {
      return this.generateWithOpenAI(originalImageBase64, roomType, styleType);
    } else {
      return this.mockGenerateStyledRoom(roomType, styleType);
    }
  }

  async generateWithOpenAI(originalImageBase64, roomType, styleType) {
    try {
      console.log(`🎨 Generating ${styleType} ${roomType} with OpenAI DALL-E...`);
      
      const prompt = this.createImagePrompt(roomType, styleType);
      
      // Use fetch to call OpenAI API directly
      const response = await fetch(`${this.openai.baseURL}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "hd",
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;
      console.log('✅ OpenAI image generated successfully');
      return imageUrl;
      
    } catch (error) {
      console.error('❌ OpenAI API error:', error.message);
      // Fallback to mock service on error
      console.log('🔄 Falling back to mock service...');
      return this.mockGenerateStyledRoom(roomType, styleType);
    }
  }

  createImagePrompt(roomType, styleType) {
    const roomName = roomType.replace("-", " ");
    
    const styleDescriptions = {
      modern: "clean lines, minimalist furniture, neutral colors, sleek surfaces, contemporary design",
      scandinavian: "light wood furniture, cozy textiles, white walls, natural light, hygge atmosphere",
      industrial: "exposed brick walls, metal fixtures, leather furniture, concrete floors, urban loft style",
      bohemian: "colorful textiles, plants, eclectic furniture, warm lighting, artistic decor",
      traditional: "classic furniture, elegant fabrics, warm colors, formal layout, timeless design",
      minimalist: "very few items, white and beige colors, simple furniture, clean open space",
      farmhouse: "rustic wood, vintage furniture, natural materials, cozy country atmosphere",
      "mid-century": "retro furniture, bold colors, geometric patterns, warm wood tones"
    };

    const styleDesc = styleDescriptions[styleType] || 'stylish modern furniture and decor';
    
    return `A beautifully designed ${styleType} ${roomName} interior featuring ${styleDesc}. Professional interior design photography, realistic lighting, high-end furniture, perfectly arranged space, architectural digest quality, 4K resolution.`;
  }

  async mockGenerateStyledRoom(roomType, styleType) {
    console.log(`🎭 Using mock service for ${styleType} ${roomType}...`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const roomImages = {
      "living-room": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      "bedroom": "https://images.unsplash.com/photo-1540518614846-7eded47432f5", 
      "kitchen": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      "dining-room": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      "bathroom": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
      "office": "https://images.unsplash.com/photo-1497366216548-37526070297c",
      "outdoor": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b"
    };
    
    return `${roomImages[roomType] || roomImages["living-room"]}?w=800&h=600&fit=crop&${styleType}`;
  }
}

module.exports = { OpenAIService };