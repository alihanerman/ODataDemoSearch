# OData Demo Search

A full-stack application demonstrating OData service integration with search functionality using Northwind database.

## Project Structure

```
ODataDemoSearch/
├── frontend/           # React frontend application
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
node server.js
```

Server runs on `http://localhost:3001`

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

- **Backend**: Node.js, Express.js, Axios
- **External API**: Northwind OData Service
- **Module System**: ES Modules
- **CORS**: Enabled for cross-origin requests
