# Users API — /users/register

## Endpoint
- **Method:** POST
- **Path:** `/users/register`

## Description
Create a new user account. The endpoint validates the input and returns a JWT token and the created user (password is not returned).

## Request body
The endpoint accepts either `fullName` or `fullname` as an object with `firstName` and optional `lastName` properties, plus `email` and `password`.

Required fields:
- `fullName` or `fullname` (object)
  - `firstName` (string) — required, minimum 2 characters
  - `lastName` (string) — optional, minimum 2 characters if provided
- `email` (string) — required, must be a valid email
- `password` (string) — required, minimum 6 characters

Example request JSON:

```json
{
  "fullName": {
    "firstName": "Jane",
## Example: Retrieve user (GET)

- **Method:** GET
- **Path:** `/users/:id` — retrieve a user by their ID

Example request:

```
GET /users/60c72b2f9b1e8a5f4c8e4b7a
```

Example success response (200):

```json
{
  "user": {
    "_id": "60c72b2f9b1e8a5f4c8e4b7a",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "email": "jane.doe@example.com",
    "socketId": null
  }
}
```

Example not found response (404):

```json
{
  "error": "User not found"
}
```

    "lastName": "Doe"
  },
  "email": "jane.doe@example.com",
  "password": "strongPassword123"
}
```

Notes:
- The controller looks for `fullName` or `fullname` and will extract `firstName`/`lastname` to build the user record.
- Passwords are hashed before being stored (see `hashPassword`).

## Responses / Status codes
- `201 Created` — User created successfully. Response body contains `token` and `user` object (password not included).

Example success response (201):

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "60c72b2f9b1e8a5f4c8e4b7a",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "email": "jane.doe@example.com",
    "socketId": null
  }
}
```

- `400 Bad Request` — Validation errors (missing/invalid fields). The response contains an `errors` array with details.

Example validation error (400):

```json
{
  "errors": [
    { "msg": "First name must be at least 2 characters long", "param": "fullName" }
  ]
}
```

- `409 Conflict` — Duplicate email (not explicitly handled in controller but may occur due to `email: unique` constraint on the model).
- `500 Internal Server Error` — Unexpected server error.

## Implementation notes
- The route uses `express-validator` to check `email`, `password` length, and `firstName` length.
- The controller hashes the password using `userModel.hashPassword` before creating the user via `user.service`.
- The created user model has a `generateAuthToken()` method which signs a JWT using `process.env.JWT_SECRET`.

## See also
- Route file: [routes/user.routes.js](routes/user.routes.js)
- Controller: [controllers/user.controllers.js](controllers/user.controllers.js)
- Service: [services/user.service.js](services/user.service.js)
- Model: [models/user.model.js](models/user.model.js)
