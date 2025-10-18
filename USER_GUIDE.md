# Shadowgres User Guide

Welcome to Shadowgres! This guide will walk you through setting up and using the Shadowgres application.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Prerequisites](#prerequisites)
3.  [Getting Started](#getting-started)
    -   [Configuration](#configuration)
    -   [Running the Application](#running-the-application)
4.  [Using the API](#using-the-api)
    -   [Authentication](#authentication)
    -   [Creating a Table](#creating-a-table)
    -   [Managing Data](#managing-data)
5.  [Frontend Usage](#frontend-usage)
6.  [Troubleshooting](#troubleshooting)

---

## 1. Introduction

Shadowgres is a lightweight, self-hostable application that provides a simple, RESTful API for managing and accessing data in user-defined tables. It's designed to be a flexible backend for small projects, prototypes, or any scenario where you need a quick and easy way to store and retrieve structured JSON data.

The system consists of a main component:
-   **Backend:** A Node.js/Express server that handles API requests, interacts with a PostgreSQL database (via Prisma), and manages data.

## 2. Prerequisites

Before you begin, ensure you have the following installed on your system:
-   [Docker](https://www.docker.com/get-started) and Docker Compose
-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) (or a compatible package manager)

## 3. Getting Started

### Configuration

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/shadowgres.git
    cd shadowgres
    ```

2.  **Backend Configuration:**
    -   Navigate to the `backend` directory: `cd backend`
    -   Create a `.env` file by copying the example: `cp .env.example .env`
    -   Open the `.env` file and set the `DATABASE_URL` and `API_KEY`. The `DATABASE_URL` should point to your PostgreSQL database. If you are using the provided `docker-compose.yml`, the default value should work.
        ```
        DATABASE_URL="postgresql://user:password@db:5432/shadowgres"
        API_KEY="YOUR_SECRET_KEY"
        ```



### Running the Application

The easiest way to run the stack (backend and database) is with Docker Compose.

1.  **Start the Services:**
    From the root directory of the project, run:
    ```bash
    docker-compose up --build
    ```
    This command will:
    -   Build the Docker image for the backend.
    -   Start the PostgreSQL database service.
    -   Run the Prisma database migrations to set up the database schema.
    -   Start the backend server on `http://localhost:3000`.

2.  **Access the Application:**
    -   **Backend API:** You can make requests to the API at `http://localhost:3000`.

## 4. Using the API

For detailed information on all available endpoints, please refer to the [API Documentation](./api_docs.md).

### Authentication

All API requests to protected endpoints must include your API key in the `x-api-key` header.

```
curl -H "x-api-key: YOUR_SECRET_KEY" http://localhost:3000/api/v1/tables
```

### Creating a Table

To create a new table, send a `POST` request to the `/api/v1/tables` endpoint.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_SECRET_KEY" \
  -d 
        "{
          "name": "My First Table"
        }"
  http://localhost:3000/api/v1/tables
```

### Managing Data

You can add, view, and update rows in your tables using the `/api/v1/tables/:tableId/rows` endpoints.

-   **Add a row:** `POST /api/v1/tables/:tableId/rows`
-   **Get all rows:** `GET /api/v1/tables/:tableId/rows`
-   **Update a row:** `PATCH /api/v1/tables/:tableId/rows/:rowId`



## 6. Troubleshooting

-   **`docker-compose up` fails:**
    -   Ensure Docker is running.
    -   Check that no other services are using the ports required by the application (e.g., 5432, 3000, 5173).
-   **API requests return `401 Unauthorized`:**
    -   Make sure you are including the `x-api-key` header in your request.
    -   Verify that the key in your header matches the one set in `backend/.env`.


---
Thank you for using Shadowgres!
