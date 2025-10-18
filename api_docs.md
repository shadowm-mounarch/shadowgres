# Shadowgres API Documentation

This document outlines the available API endpoints for the Shadowgres backend, including their functionality, authentication requirements, and expected request/response formats.

## Authentication

All API endpoints under `/api/v1/tables` require API key authentication. You must include an `x-api-key` header with a valid API key in your requests. The API key is configured via the `API_KEY` environment variable on the server.

**Header Example:**
```
x-api-key: YOUR_API_KEY
```

## Data Models

The following data models are used in the API:

### User
Represents a user in the system.
- `id`: String (Unique identifier)
- `email`: String (Unique email address)
- `password`: String (Hashed password)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Table
Represents a user-defined table.
- `id`: String (Unique identifier)
- `name`: String (Name of the table)
- `slug`: String (URL-friendly unique identifier for the table, derived from the name)
- `ownerId`: String (ID of the user who owns the table)
- `config`: JSON (Configuration settings for the table)
- `columns`: Relation to `Column` model
- `rows`: Relation to `Row` model
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Column
Represents a column within a table.
- `id`: String (Unique identifier)
- `tableId`: String (ID of the parent table)
- `name`: String (Name of the column)
- `type`: String (Data type of the column, e.g., "string", "number", "boolean")
- `settings`: JSON (Settings specific to the column type)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Row
Represents a row of data within a table.
- `id`: String (Unique identifier)
- `tableId`: String (ID of the parent table)
- `data`: JSON (The actual data for the row, where keys are column names and values are cell data)
- `createdBy`: String (ID of the user who created the row)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Endpoints

### 1. Get Root Endpoint

- **URL:** `/`
- **Method:** `GET`
- **Description:** A basic health check or welcome message for the API.
- **Authentication:** None
- **Response:**
    - `200 OK`:
        ```
        Hello from Shadowgres Backend!
        ```

### 2. Create New Table

- **URL:** `/api/v1/tables`
- **Method:** `POST`
- **Description:** Creates a new table in the system.
- **Authentication:** Required (`x-api-key`)
- **Request Body:**
    ```json
    {
      "name": "My New Table"
    }
    ```
    - `name`: (string, required) The desired name for the new table.
- **Responses:**
    - `201 Created`: Returns the newly created table object.
        ```json
        {
          "id": "cloej12340000abcde1234567",
          "name": "My New Table",
          "slug": "my-new-table",
          "ownerId": "admin",
          "config": {},
          "createdAt": "2025-10-17T10:00:00.000Z",
          "updatedAt": "2025-10-17T10:00:00.000Z"
        }
        ```
    - `400 Bad Request`: If the `name` field is missing from the request body.
        ```json
        {
          "error": "Table name is required"
        }
        ```
    - `409 Conflict`: If a table with the provided name (or generated slug) already exists.
        ```json
        {
          "error": "A table with this name already exists."
        }
        ```
    - `500 Internal Server Error`: For other server-side errors.

### 3. Get All Rows for a Table

- **URL:** `/api/v1/tables/:tableId/rows`
- **Method:** `GET`
- **Description:** Retrieves all data rows associated with a specific table.
- **Authentication:** Required (`x-api-key`)
- **URL Parameters:**
    - `tableId`: (string, required) The unique identifier of the table.
- **Responses:**
    - `200 OK`: Returns an array of row objects.
        ```json
        [
          {
            "id": "cloej12340001abcde1234568",
            "tableId": "cloej12340000abcde1234567",
            "data": {
              "column1": "valueA",
              "column2": 123
            },
            "createdBy": "admin",
            "createdAt": "2025-10-17T10:05:00.000Z",
            "updatedAt": "2025-10-17T10:05:00.000Z"
          },
          // ... more row objects
        ]
        ```
    - `400 Bad Request`: If `tableId` is missing from the URL.
        ```json
        {
          "error": "Table ID is required"
        }
        ```
    - `500 Internal Server Error`: For other server-side errors.

### 4. Add New Row to Table

- **URL:** `/api/v1/tables/:tableId/rows`
- **Method:** `POST`
- **Description:** Adds a new data row to a specific table. The structure of the `data` object in the request body should match the columns defined for the table.
- **Authentication:** Required (`x-api-key`)
- **URL Parameters:**
    - `tableId`: (string, required) The unique identifier of the table.
- **Request Body:**
    ```json
    {
      "data": {
        "column_name_1": "value_for_column_1",
        "column_name_2": 123,
        "column_name_3": true
      }
    }
    ```
    - `data`: (JSON object, required) An object containing the data for the new row. Keys should correspond to column names, and values to the cell data.
- **Responses:**
    - `200 OK`: Returns the newly created row object.
        ```json
        {
          "id": "cloej12340002abcde1234569",
          "tableId": "cloej12340000abcde1234567",
          "data": {
            "column_name_1": "value_for_column_1",
            "column_name_2": 123,
            "column_name_3": true
          },
          "createdBy": "admin",
          "createdAt": "2025-10-17T10:10:00.000Z",
          "updatedAt": "2025-10-17T10:10:00.000Z"
        }
        ```
    - `400 Bad Request`: If `tableId` is missing from the URL.
        ```json
        {
          "error": "Table ID is required"
        }
        ```
    - `500 Internal Server Error`: For other server-side errors.

### 5. Update Specific Row in Table

- **URL:** `/api/v1/tables/:tableId/rows/:rowId`
- **Method:** `PATCH`
- **Description:** Updates an existing data row in a specific table. The `data` object in the request body should contain the fields to be updated.
- **Authentication:** Required (`x-api-key`)
- **URL Parameters:**
    - `tableId`: (string, required) The unique identifier of the table.
    - `rowId`: (string, required) The unique identifier of the row to update.
- **Request Body:**
    ```json
    {
      "data": {
        "column_to_update_1": "new_value_1",
        "column_to_update_2": "new_value_2"
      }
    }
    ```
    - `data`: (JSON object, required) An object containing the data for the row to be updated. Keys should correspond to column names, and values to the new cell data. Only provide the fields you wish to update.
- **Responses:**
    - `200 OK`: Returns the updated row object.
        ```json
        {
          "id": "cloej12340002abcde1234569",
          "tableId": "cloej12340000abcde1234567",
          "data": {
            "column_name_1": "updated_value_1",
            "column_name_2": 123,
            "column_name_3": true
          },
          "createdBy": "admin",
          "createdAt": "2025-10-17T10:10:00.000Z",
          "updatedAt": "2025-10-17T10:10:00.000Z"
        }
        ```
    - `400 Bad Request`: If `tableId`, `rowId` or `data` is missing from the request.
        ```json
        {
          "error": "Table ID and Row ID are required"
        }
        ```
    - `404 Not Found`: If the specified row does not exist.
        ```json
        {
          "error": "Row not found"
        }
        ```
    - `500 Internal Server Error`: For other server-side errors.
