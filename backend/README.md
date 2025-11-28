# SignBuddy Backend

This is the backend API for the SignBuddy sign language learning application.

## Features

- User authentication (registration and login)
- Chapter progress tracking
- Dictionary management
- MongoDB integration
- JWT-based authentication
- RESTful API design

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt for password hashing

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Progress
- `GET /api/progress` - Get user's chapter progress (protected)
- `POST /api/progress/update` - Update chapter progress (protected)
- `GET /api/progress/completed` - Get completed chapters (protected)

### Dictionary
- `GET /api/dictionary` - Get all dictionary items
- `GET /api/dictionary/category/:category` - Get dictionary items by category
- `GET /api/dictionary/search?query=` - Search dictionary items
- `GET /api/dictionary/:id` - Get dictionary item by ID
- `POST /api/dictionary/add` - Add a new dictionary item (protected)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## Database Models

### User
- username (String, unique)
- email (String, unique)
- password (String, hashed)
- progress (Map of chapter progress)
- createdAt (Date)

### ChapterProgress
- userId (ObjectId, ref to User)
- chapterId (Number)
- completed (Boolean)
- score (Number)
- completedAt (Date)

### DictionaryItem
- word (String)
- sign (String)
- category (String, enum)
- cloudinaryUrl (String, optional)
- createdAt (Date)