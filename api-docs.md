# Netflix API Documentation

## Endpoints

### 1. Get All Netflix Titles
- **Endpoint**: `/titles`
- **Method**: GET
- **Description**: Get a list of all Netflix titles.

### 2. Get a Specific Title by ID
- **Endpoint**: `/titles/:id`
- **Method**: GET
- **Description**: Get details of a specific Netflix title by providing its ID.


### 3. Get Titles in a Specific Category
- **Endpoint**: `/titles/categories/:category`
- **Method**: GET
- **Description**: Get titles in a specific category.


### 4. Get Titles of a Specific Type (Movie or TV Show)
- **Endpoint**: `/titles/types/:type`
- **Method**: GET
- **Description**: Get titles of a specific type (movie or TV show).


### 5. Get Titles from a Specific Country
- **Endpoint**: `/titles/countries/:country`
- **Method**: GET
- **Description**: Get titles from a specific country.


### 6. API Documentation
- **Endpoint**: `/`
- **Method**: GET
- **Description**: View the API documentation.


## Error Handling
- If a resource is not found, a 404 status with an error message is returned.
- For internal server errors, a 500 status with an error message is returned.

## Response Format
- Responses are in JSON format.

## Example API Documentation
- This document provides a brief overview of the available endpoints and how to use them.


