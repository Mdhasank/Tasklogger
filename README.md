# TaskLogger

## Project Overview

TaskLogger is a full-stack web application designed for efficient task management. It allows users to create, view, update, and delete tasks with features like status tracking and due dates. The application consists of a React-based frontend for user interaction and an Express.js backend for API services, all containerized with Docker for easy deployment.

## Features

- **Task Management**: Create, read, update, and delete tasks seamlessly.
- **Status Tracking**: Mark tasks as pending or completed.
- **Due Dates**: Assign and track due dates for tasks.
- **Responsive UI**: Built with React for a modern, responsive user interface.
- **RESTful API**: Backend provides a clean API for task operations.
- **Pagination**: Efficiently handle large lists of tasks with pagination support.
- **Containerization**: Fully dockerized for consistent environments.
- **CI/CD**: Automated pipeline with Jenkins for building, testing, and deployment.

## Tech Stack

- **Backend**:
  - Node.js (v18+ recommended)
  - Express.js (^4.18.2)
  - CORS (^2.8.5)
  - Testing: Jest (^29.5.0), Supertest (^6.3.3)

- **Frontend**:
  - React (^18.2.0)
  - Vite (^4.4.5) for build tooling
  - Testing: Vitest (^0.34.1), Testing Library

- **Containerization**:
  - Docker
  - Docker Compose

- **CI/CD**:
  - Jenkins

## Project Structure

```
tasklogger/
├── backend/                 # Express.js API server
│   ├── Dockerfile           # Backend container configuration
│   ├── package.json         # Backend dependencies and scripts
│   ├── server.js            # Main server file
│   └── tests/               # Backend tests
│       └── tasks.test.js
├── frontend/                # React application
│   ├── Dockerfile           # Frontend container configuration
│   ├── package.json         # Frontend dependencies and scripts
│   ├── vite.config.js       # Vite configuration
│   ├── public/              # Static assets
│   │   ├── index.html
│   │   └── manifest.json
│   └── src/                 # Source code
│       ├── App.css
│       ├── App.jsx
│       ├── App.test.js
│       ├── App.test.jsx
│       ├── index.css
│       ├── index.js
│       ├── index.jsx
│       └── setupTests.js
├── docker-compose.yml       # Multi-container setup
├── Jenkinsfile              # CI/CD pipeline
└── README.md                # This file
```

## Setup and Installation

### Prerequisites

- Docker and Docker Compose installed on your system
- Node.js (v18 or higher) and npm for local development
- Git for cloning the repository

### Quick Start with Docker

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tasklogger
   ```

2. **Build and run the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: Open [http://localhost:3000](http://localhost:3000) in your browser
   - Backend API: Available at [http://localhost:5000](http://localhost:5000)

### Local Development Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000).

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173) (Vite's default port).

### Environment Variables

- **Backend**:
  - `NODE_ENV`: Set to `production` for production builds (handled by Docker Compose)

For local development, no additional environment variables are required.

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

Tests are run automatically in the Jenkins CI/CD pipeline.

## API Documentation

The backend provides a RESTful API for task management. All endpoints return JSON responses.

### Base URL
`http://localhost:5000/api`

### Endpoints

- **GET /api/health**
  - Health check endpoint
  - Response: `{"status": "OK"}`

- **GET /api/tasks**
  - Retrieve paginated list of tasks
  - Query Parameters:
    - `page` (optional): Page number (default: 1)
    - `limit` (optional): Items per page (default: 10)
  - Response:
    ```json
    {
      "tasks": [...],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 50,
        "pages": 5
      }
    }
    ```

- **GET /api/tasks/:id**
  - Retrieve a specific task by ID
  - Response: Task object

- **POST /api/tasks**
  - Create a new task
  - Request Body:
    ```json
    {
      "title": "Task Title",
      "description": "Task Description",
      "status": "pending",
      "dueDate": "2023-12-31"
    }
    ```

- **PUT /api/tasks/:id**
  - Update an existing task
  - Request Body: Same as POST, all fields optional

- **DELETE /api/tasks/:id**
  - Delete a task by ID
  - Response: `{"message": "Task deleted successfully"}`

### Task Data Structure

```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "status": "pending",
  "dueDate": "2023-12-31T23:59:59.000Z",
  "createdAt": "2023-10-01T00:00:00.000Z",
  "updatedAt": "2023-10-01T00:00:00.000Z"
}
```

- `id`: Unique identifier (auto-generated)
- `title`: Task title (required, string)
- `description`: Task description (optional, string)
- `status`: Task status ("pending" or "completed")
- `dueDate`: Due date in ISO 8601 format (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## CI/CD Pipeline

The project uses Jenkins for continuous integration and deployment. The pipeline includes:

1. **Checkout**: Pull latest code from repository
2. **Build**: Create Docker images for backend and frontend
3. **Test**: Run unit tests for both services
4. **Deploy**: Push images to Docker Hub registry

Images are tagged as `garcia123/task-logger-backend:latest` and `garcia123/task-logger-frontend:latest`.

## Deployment

### Using Docker Compose

For production deployment:

```bash
docker-compose up -d --build
```

### Manual Docker Deployment

1. Build images:
   ```bash
   docker build -t task-logger-backend ./backend
   docker build -t task-logger-frontend ./frontend
   ```

2. Run containers:
   ```bash
   docker run -d -p 5000:5000 task-logger-backend
   docker run -d -p 3000:80 task-logger-frontend
   ```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Run tests: `npm test` in respective directories
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

### Code Style

- Use ESLint for JavaScript/React code
- Follow standard naming conventions
- Write descriptive commit messages
- Add tests for new features

## Troubleshooting

### Common Issues

- **Port conflicts**: Ensure ports 3000 and 5000 are available
- **Docker issues**: Make sure Docker Desktop is running
- **Node version**: Use Node.js v18+ for compatibility

### Logs

- Backend logs: `docker logs <backend-container-id>`
- Frontend logs: `docker logs <frontend-container-id>`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- Mohd Hasan Khan (Maintainer)
