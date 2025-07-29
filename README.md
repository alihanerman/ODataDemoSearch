# OData Demo Search

A full-stack application demonstrating OData service integration with search functionality using Northwind database.

## Project Structure

```
ODataDemoSearch/
├── frontend/           # Next.js frontend application
├── odata-proxy-backend/  # Express.js proxy backend
├── .gitignore
└── README.md
```

## Features

- 🔍 Search customers from Northwind OData service
- 🚀 Express.js proxy backend with ES modules
- ⚡ Real-time search functionality
- 🎯 Searches across: Company Name, Contact Name, City, Country
- 📊 Returns: Customer ID, Company Name, Contact Name, City, Country

## Backend

The backend serves as a proxy to the Northwind OData service, providing:

- Search endpoint: `/api/search?q=search_term`
- CORS enabled for frontend integration
- ES module support
- Error handling and logging

### Backend Setup

```bash
cd odata-proxy-backend
npm install
npm start  # or npm run dev for development
```

Server runs on `http://localhost:3001` (development) or `PORT` environment variable (production)

## Frontend

Next.js application with TypeScript providing modern search interface.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # for development
npm run build && npm start  # for production
```

Frontend runs on `http://localhost:3000`

### Environment Variables

Create `frontend/.env.local` for development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Deployment

### Backend Deployment (Render.com)

1. **Root Directory**: `odata-proxy-backend`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**: `PORT` (auto-provided by Render)

### Frontend Deployment (Vercel/Netlify/Render)

1. **Root Directory**: `frontend`
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com`

### Full Setup Commands

```bash
# Install all dependencies
npm run deploy:setup

# Development
npm run dev

# Individual services
npm run start:backend
npm run start:frontend
```

## API Usage

```bash
GET /api/search?q=alfki
```

Response:

```json
[
  {
    "CustomerID": "ALFKI",
    "CompanyName": "Alfreds Futterkiste",
    "ContactName": "Maria Anders",
    "City": "Berlin",
    "Country": "Germany"
  }
]
```

## Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Node.js, Express.js, Axios
- **External API**: Northwind OData Service
- **Module System**: ES Modules
- **CORS**: Enabled for cross-origin requests
- **Deployment**: Render.com (backend), Vercel/Netlify (frontend)
