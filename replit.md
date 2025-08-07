# AI Interior Design Platform

An AI-powered interior design platform for virtual staging and room transformation with image generation capabilities

## Current Status (August 7, 2025)
✅ **Backend Server**: Fully functional Express.js API running on port 3000
✅ **Image Upload**: Working file upload with Sharp image processing
✅ **AI Integration**: Real OpenAI DALL-E 3 service generating authentic styled room images
✅ **Project Management**: CRUD operations for design projects
⏳ **Frontend**: React application configured, needs startup troubleshooting

## Architecture
- **Backend**: Express.js server (server.cjs) with in-memory storage
- **Frontend**: React + Vite + TypeScript with Tailwind CSS
- **AI Service**: Real OpenAI DALL-E 3 integration with fallback to mock service
- **File Processing**: Sharp for image optimization and resizing

## API Endpoints
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get single project  
- `POST /api/projects` - Create new project with image upload
- Static serving: `/uploads/*` for processed images

## Development
- Backend: `node server.cjs` (port 3000)
- Frontend: `npx vite` (port 5173) with proxy to backend
- Combined: Use start.cjs or concurrently for both servers, similar to Collov.ai.

## Project Overview

This is a full-stack web application that allows users to:
- Upload photos of empty or furnished rooms
- Select room types (living room, bedroom, kitchen, etc.) and design styles (modern, scandinavian, industrial, etc.)
- Use AI to generate professionally styled versions of their rooms
- View and manage their design projects in a gallery
- Download high-quality styled images

## Architecture

### Backend (Node.js/Express)
- **Server**: Express.js server with TypeScript
- **Storage**: In-memory storage (MemStorage) for quick development
- **AI Service**: OpenAI integration with fallback to mock service
- **Image Processing**: Sharp for image optimization and processing
- **File Upload**: Multer for handling image uploads

### Frontend (React/Vite)
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom shadcn/ui-inspired components

### Key Features
1. **Image Upload & Processing**: Users can upload room photos with preview
2. **AI Styling**: Integration with OpenAI's image generation (with mock fallback)
3. **Real-time Status**: Live updates during AI processing
4. **Project Gallery**: View all projects with status indicators
5. **Professional UI**: Clean, modern interface optimized for design workflows

## File Structure

```
├── server/
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   └── aiService.ts      # AI image generation service
├── src/
│   ├── components/       # React components
│   ├── pages/           # Route pages
│   ├── lib/             # Utilities and configuration
│   └── main.tsx         # Frontend entry point
├── shared/
│   └── schema.ts        # Shared data models and validation
└── uploads/             # Uploaded images storage
```

## Development Status

### Completed Features
- ✅ Complete data models and validation schemas
- ✅ Backend API with image upload and processing
- ✅ AI service with OpenAI integration and mock fallback
- ✅ Frontend UI components and pages
- ✅ Project creation workflow
- ✅ Real-time project status updates
- ✅ Gallery view with project management
- ✅ Responsive design for mobile and desktop

### Next Steps
- Start the development server
- Test the complete workflow
- Add error handling improvements
- Optimize image processing performance

## Technical Decisions

1. **Mock AI Service**: Implemented fallback to Unsplash images when OpenAI API key is not available, allowing development without API costs
2. **In-Memory Storage**: Using MemStorage for rapid prototyping; easily upgradeable to database
3. **Real-time Updates**: Polling-based status updates during AI processing
4. **Image Processing**: Sharp for optimized image handling and resizing

## User Preferences
- Focus on professional, clean UI design
- Prioritize user experience with clear status indicators
- Implement comprehensive error handling
- Support both development (mock) and production (real AI) modes

## Recent Changes
- **2025-01-07**: Initial project creation with full-stack architecture
- **2025-01-07**: Implemented complete AI interior design platform with OpenAI integration
- **2025-01-07**: Created responsive UI with real-time project status updates