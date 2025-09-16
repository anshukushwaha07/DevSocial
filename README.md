# DevSocial


# devSocial - Backend ✨

This is the backend server for **devSocial**, a social hub for developers designed to showcase GitHub projects, foster collaboration, and provide AI-powered insights. This server handles user authentication, data management, and the core business logic for the platform.

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#-environment-variables)
- [Running The Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)

## 📖 About The Project

`devSocial` aims to bridge the gap between a code repository and a social network. Developers can import their public GitHub repositories, get AI-generated summaries of their projects, and engage in discussions with a community of peers. This backend provides the RESTful API and WebSocket services required to power the `devSocial` frontend.

## 🚀 Features

### Implemented Features

-   ✅ **GitHub OAuth2 Authentication:** Secure user sign-up and login using their GitHub account.
-   ✅ **JWT-based Sessions:** Stateless authentication using JSON Web Tokens for secure and scalable API communication.
-   ✅ **Protected Routes:** Middleware to protect specific endpoints, ensuring only authenticated users can access them.
-   ✅ **User Profile Management:** Automatic creation of user profiles from their GitHub data upon registration.

### Planned Features

-   [ ] **Project Importing:** Endpoints to fetch and import a user's public GitHub repositories.
-   [ ] **AI Repo Summarizer:** Integration with a Generative AI model (like Gemini) to summarize codebases.
-   [ ] **Discussion Boards:** Full CRUD API for posts, comments, and reactions.
-   [ ] **Real-time Chat:** WebSocket integration for direct and group messaging.
-   [ ] **Follower System:** APIs to manage social connections between users.

## 🛠️ Tech Stack

-   **Runtime:** [Node.js](https://nodejs.org/)
-   **Framework:** [Express.js](https://expressjs.com/)
-   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
-   **Authentication:** [Passport.js](http://www.passportjs.org/) (GitHub Strategy) & [JSON Web Token (JWT)](https://jwt.io/)
-   **Middleware:** [CORS](https://expressjs.com/en/resources/middleware/cors.html)
-   **Environment Variables:** [Dotenv](https://github.com/motdotla/dotenv)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following software installed on your machine:

-   [Node.js](https://nodejs.org/en/download/) (v18.x or higher recommended)
-   [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/)
-   [Git](https://git-scm.com/downloads)
-   A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (or a local MongoDB server).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://your-repository-url/devsocial_backend.git
    cd devsocial_backend
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file.
    ```sh
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in the required values. See the [Environment Variables](#-environment-variables) section below for details.

## 🔒 Environment Variables

To run the application, you need to configure the following environment variables in a `.env` file. It's recommended to create this file from the provided `.env.example`.

-   `PORT`: The port on which the server will run (e.g., `5001`).
-   `MONGO_URI`: Your MongoDB connection string.
-   `JWT_SECRET`: A long, random, secret string used for signing JWTs.
-   `GITHUB_CLIENT_ID`: The Client ID from your GitHub OAuth App.
-   `GITHUB_CLIENT_SECRET`: The Client Secret from your GitHub OAuth App.
-   `FRONTEND_URL`: The base URL of your frontend application (e.g., `http://localhost:3000`).

## ⚙️ Running The Application

You can run the server in two modes:

-   **Development Mode:** Uses `nodemon` to automatically restart the server on file changes.
    ```sh
    npm run dev
    ```

-   **Production Mode:**
    ```sh
    npm start
    ```

The server will be available at `http://localhost:5001` (or whatever port you specified).

## 🔌 API Endpoints

Here is a list of the currently available API endpoints.

| Method | Endpoint                             | Description                                  | Access    |
| :----- | :----------------------------------- | :------------------------------------------- | :-------- |
| `GET`  | `/api/users/auth/github`             | Initiates the GitHub OAuth2 login flow.      | `Public`  |
| `GET`  | `/api/users/auth/github/callback`    | GitHub redirects here after authorization.   | `Public`  |
| `GET`  | `/api/users/me`                      | Retrieves the current authenticated user's profile. | `Private` |

## 📁 Project Structure

The project follows a feature-based, separation-of-concerns structure to ensure scalability and maintainability.

/src
├── api/             # API routes, controllers, and middlewares
├── config/          # Configuration files (DB, Passport)
├── models/          # Mongoose data models (schemas)
├── services/        # Business logic for external APIs
└── utils/           # Utility and helper functions


-   **`src/api/`**: This is the core of the API layer, handling all HTTP requests.
    -   **`routes/`**: Defines all API endpoints and maps them to the appropriate controller functions.
    -   **`controllers/`**: Contains the business logic. It processes requests, interacts with models and services, and sends back a response.
    -   **`middlewares/`**: Holds functions that run before the controller logic, used for tasks like authentication (`auth.middleware.js`), validation, or logging.

-   **`src/config/`**: Contains configuration files for various parts of the application, such as database connection logic (`db.js`) and authentication strategies (`passport.js`).

-   **`src/models/`**: Defines the Mongoose schemas for our MongoDB collections. Each file represents the structure of a data entity (e.g., `user.model.js`).

-   **`src/services/`**: Used for more complex business logic that doesn't fit in a controller, especially logic involving communication with external APIs (like using Octokit to talk to GitHub).

-   **`src/utils/`**: A collection of small, reusable helper functions that can be used across the entire application (e.g., `generateToken.js`).


