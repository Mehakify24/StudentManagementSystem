# Student Management System Documentation

## Architecture Overview
This project is a full-stack User Management System split into a Node.js backend and a React frontend.

- **Backend:** Express server connected to MongoDB via Mongoose. It exposes a REST API for authentication and user retrieval.
- **Frontend:** React application bundled with Vite. Uses React Router for navigation and plain CSS for styling.

## Roles and Permissions
1. **Student:** Can register, login, view their own profile, and upload a profile picture.
2. **Admin:** Automatically seeded. Can view a list of all registered students, including their personal details and profile pictures.

## Database Schema (User)
The core entity is the `User` model, replacing the older `Student` model to support roles.
- `name` (String, required)
- `email` (String, required, unique)
- `dob` (Date)
- `address` (String)
- `collegeId` (String, unique)
- `contact` (String)
- `profilePicture` (String - path to image stored locally)
- `password` (String, hashed)
- `role` (String, enum: ["student", "admin"], default: "student")

## API Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user (supports `multipart/form-data`) | No |
| POST | `/api/auth/login` | Login and receive a JWT | No |
| GET | `/api/auth/me` | Fetch details of the currently logged-in user | Yes |
| GET | `/api/auth/users` | Fetch all registered students | Yes (Admin only) |

## File Uploads
Profile pictures are uploaded using `multer`. The images are stored in `backend/uploads/` and are served statically by the backend server. The frontend renders them by prepending the backend `BASE_URL`.

## Setup Instructions
1. Install dependencies in both `backend` and `frontend` (`npm install`).
2. Create `.env` in `backend` with `PORT`, `MONGO_URI`, and `JWT_SECRET`.
3. Run `npm run dev` in both directories.
