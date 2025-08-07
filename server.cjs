const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const { createServer } = require('http');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// In-memory storage
const projects = new Map();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Room type labels
const roomTypeLabels = {
  'living-room': 'Living Room',
  'bedroom': 'Bedroom',
  'kitchen': 'Kitchen',
  'dining-room': 'Dining Room',
  'bathroom': 'Bathroom',
  'office': 'Home Office',
  'outdoor': 'Outdoor Space'
};

// Mock AI service
async function mockGenerateStyledRoom(roomType, styleType) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const roomImages = {
    'living-room': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    'bedroom': 'https://images.unsplash.com/photo-1540518614846-7eded47432f5',
    'kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    'dining-room': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
    'bathroom': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14',
    'office': 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    'outdoor': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b'
  };
  
  return `${roomImages[roomType] || roomImages['living-room']}?w=800&h=600&fit=crop`;
}

// API Routes

// Get all projects
app.get('/api/projects', (req, res) => {
  const projectList = Array.from(projects.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(projectList);
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Create new project
app.post('/api/projects', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { title, roomType, styleType } = req.body;
    
    if (!title || !roomType || !styleType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process and save the uploaded image
    const processedImage = await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Create filename and save
    const filename = `original-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
    await fs.mkdir('uploads', { recursive: true });
    await fs.writeFile(path.join('uploads', filename), processedImage);

    const originalImageUrl = `/uploads/${filename}`;

    // Create project
    const project = {
      id: Math.random().toString(36).substring(2, 15),
      title,
      roomType,
      styleType,
      originalImageUrl,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };

    projects.set(project.id, project);
    res.json(project);

    // Start AI processing in background
    processProjectAsync(project.id, processedImage, roomType, styleType);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Background processing function
async function processProjectAsync(projectId, imageBuffer, roomType, styleType) {
  try {
    const startTime = Date.now();

    // Simulate AI processing
    const styledImageUrl = await mockGenerateStyledRoom(roomType, styleType);
    const processingTime = Date.now() - startTime;

    // Update project with results
    const project = projects.get(projectId);
    if (project) {
      project.status = 'completed';
      project.styledImageUrl = styledImageUrl;
      project.processingTimeMs = processingTime;
      projects.set(projectId, project);
    }
  } catch (error) {
    console.error('Error processing project:', error);
    
    // Mark project as failed
    const project = projects.get(projectId);
    if (project) {
      project.status = 'failed';
      projects.set(projectId, project);
    }
  }
}

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});