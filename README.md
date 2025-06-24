# Library Management System

A robust TypeScript-based RESTful API for managing a library's book inventory and borrowing operations. Built with **Express**, **Mongoose**, and **MongoDB**, this application provides a scalable solution for librarians to manage books, track borrowing, and generate summaries, with strong error handling and validation.
Here goes the live link to the server : https://library-management-system-one-omega.vercel.app/

## Features

- **Book Management**:

  - Create, read, update, and delete (CRUD) books with details like title, author, genre, ISBN, description, and available copies.
  - Validate book data (e.g., non-negative copies, valid genres).
  - Automatically update availability based on copies using Mongoose middleware.

- **Borrowing System**:

  - Borrow books, deducting copies from inventory.
  - Validate requests (e.g., valid book ID, positive quantity, future due date).
  - Prevent borrowing if insufficient copies are available.

- **Borrow Summary**:

  - Generate a report of borrowed books with total quantities and book details (title, ISBN) using MongoDB aggregation.

- **Error Handling**:

  - Centralized handling for validation errors, invalid IDs, and general errors.
  - User-friendly messages (e.g., "Copies must be a positive number").
  - Consistent response format: `{ success, message, data/error }`.

- **Type Safety**:

  - Written in TypeScript for strict typing and improved developer experience.
  - Defined interfaces for books, borrow requests, and errors.

- **Mongoose Middleware**:
  - `pre('save')` middleware ensures the `available` field reflects `copies` status.

## Prerequisites

- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
- **TypeScript**: Installed globally (`npm install -g typescript`) or locally
- **Git**: For version control
- **VS Code**: Recommended for editing

## Local Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/BadgerSIO/libraryManagement.git
   cd library-management-system
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library
   NODE_ENV=development
   ```

   Replace `MONGODB_URI` with your MongoDB connection string (e.g., MongoDB Atlas URI).

4. **Set Up MongoDB**:

   - Start a local MongoDB server:
     ```bash
     mongod
     ```
   - Or use MongoDB Atlas:
     - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
     - Get the connection string (e.g., `mongodb+srv://username:password@cluster0.mongodb.net/library?retryWrites=true&w=majority`).
     - Update `.env` with the URI.

5. **Compile TypeScript**:

   ```bash
   npx tsc
   ```

6. **Run the Application**:

   ```bash
   npm run dev
   ```

   The server runs at `http://localhost:5000`.

7. **Verify Setup**:
   ```bash
   curl http://localhost:5000
   ```
   Expected response: `Library server running 🥳`

## API Endpoints

Base URL: `/api`

- **Books**:

  - `POST /books`: Create a book
    ```json
    {
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5
    }
    ```
  - `GET /books`: List books (supports `filter`, `sortBy`, `order`, `limit`)
  - `GET /books/:bookId`: Get a book
  - `PUT /books/:bookId`: Update a book
  - `DELETE /books/:bookId`: Delete a book

- **Borrowing**:
  - `POST /borrow`: Borrow a book
    ```json
    {
      "book": "68595c96d7ebd77e642172d7",
      "quantity": 2,
      "dueDate": "2025-07-18T00:00:00Z"
    }
    ```
  - `GET /borrow/summary`: Get borrow summary

### Example Requests

- **Create Book**:

  ```bash
  curl -X POST http://localhost:5000/api/books -H "Content-Type: application/json" -d '{"title":"Test Book","author":"Test Author","genre":"FICTION","isbn":"1234567890123","copies":5}'
  ```

- **Get Book**:

  ```bash
  curl http://localhost:5000/api/books/68595c96d7ebd77e642172d7
  ```

- **Borrow Book**:
  ```bash
  curl -X POST http://localhost:5000/api/borrow -H "Content-Type: application/json" -d '{"book":"68595c96d7ebd77e642172d7","quantity":2,"dueDate":"2025-07-18T00:00:00Z"}'
  ```

## Error Handling

Errors follow a consistent format:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0,
          "path": "copies",
          "value": -5
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

## Development

- **Scripts**:
  - `npm run dev`: Run in development with `ts-node-dev`
  - `npm run build`: Compile TypeScript
  - `npm start`: Run compiled server
