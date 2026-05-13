# Detail Scaling

A Quadtree-Based Data Partitioning Platform for Intelligent Image Compression

## Overview

Detail Scaling is an advanced web application framework that leverages recursive Quadtree Decomposition to intelligently compress images while preserving detail only where it matters most. Rather than applying uniform compression, the engine evaluates color variance in each region and subdivides only when that variance exceeds a user-defined threshold.

## Key Features

- **Interactive Compression Sandbox**: Upload images and manipulate a threshold slider to see real-time quadtree subdivision
- **Spatial Inspector Tool**: Reveals depth variance and quality metrics of selected quadtree nodes
- **Performance HUD**: Real-time dashboard displaying O(N log N) complexity metrics
- **Scenario Library**: Save and compare compression snapshots to MongoDB
- **Real-Time Canvas Rendering**: 60 FPS visualization using HTML5 Canvas API
- **Performance Analytics**: Benchmark comparisons showing O(N log N) vs O(N²) scaling
- **Mobile Responsive**: Full platform accessibility across devices using Tailwind CSS

## Problem Solved

Addresses data-transmission challenges for high-resolution imagery in low-bandwidth environments. Ideal for:
- Satellite imagery
- Medical scans
- GIS mapping
- Any bandwidth-constrained visual data transmission

## Tech Stack

### Frontend
- **React.js** (Vite): State management for high-frequency Canvas updates
- **HTML5 Canvas**: Rendering recursive quadtree partitions at 60 FPS
- **Tailwind CSS**: Modern utility-first styling with dark mode support

### Backend
- **Node.js** with Express.js: Heavy lifting for pixel analysis and buffer processing
- **JWT Authentication**: Stateless backend authentication

### Database
- **MongoDB Atlas**: Stores serialized tree structures (JSON) and performance logs

## Project Structure

```
DetailScaling/
├── frontend/          # React + Vite application
├── backend/           # Express.js API server
├── README.md
├── LICENSE
├── package.json
└── .gitignore
```

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with Quick Demo hero section |
| `/sandbox` | Interactive playground with Canvas renderer and threshold slider |
| `/benchmarks` | Analytics dashboard with O(N log N) vs O(N²) comparison charts |
| `/library` | Gallery of saved compression snapshots |
| `/about` | Technical explanation of quadtree logic and mathematics |

## Core Algorithm

**Quadtree Decomposition**: The engine recursively subdivides 2D space based on color variance thresholds:
- Each recursive call reads a 2D pixel region
- Computes the region's color variance
- Either stores as leaf node (below threshold) or subdivides into four child quadrants
- Results in optimal compression with preserved perceptual quality

**Complexity**: O(N log N) average case for recursive partitioning

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB Atlas account (free tier available)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd DetailScaling
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

3. Configure environment variables:
```bash
# backend/.env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Running the Application

### Development Mode

```bash
# From root directory
npm run dev
```

This starts both frontend (Vite dev server on port 5173) and backend (Express on port 5000).

### Production Build

```bash
npm run build
npm run start
```

### Frontend Only
```bash
cd frontend
npm run dev
```

### Backend Only
```bash
cd backend
npm start
```

## Deployment

- **Frontend**: Deployed on Vercel with automatic CI/CD from GitHub
- **Backend**: Runs on Render (free tier compatible)
- **Database**: MongoDB Atlas (cloud-hosted)
- **Zero Local Installation**: Fully live stack accessible via web browser

## Real-Time Features

- **Threshold Slider**: Debounced state updates trigger full quadtree decomposition at 60 FPS
- **Persistent Logging**: Compression metadata automatically saved to MongoDB
- **Spatial Inspector**: Hover-based overlay revealing depth and variance metrics
- **Snapshot Comparison**: Side-by-side before/after compression visualization

## Performance Metrics

The application tracks:
- Total node count
- Maximum tree depth
- Compression ratio
- O(N) complexity score
- Processing time

All metrics are stored in MongoDB for trend analysis and benchmarking.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Project developed as part of MCA 2026 curriculum at PES University (PES1PG25CA)

## Future Enhancements

- Machine Learning-based adaptive threshold prediction
- Advanced microservices architecture
- Real-time collaborative compression sessions
- Export to multiple image formats
