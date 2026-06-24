## Users API — /users/register

## Endpoint
- **Method:** POST
- **Path:** `/users/register`

## Description
Create a new user account. The endpoint validates the input and returns a JWT token and the created user (password is not returned).

## Request body
The endpoint accepts `fullname` as an object with `firstName` and optional `lastName` properties, plus `email` and `password`.

Required fields:
- `fullname` (object)
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
- The controller looks for `fullname` and will extract `firstName`/`lastname` to build the user record.
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

## Login Endpoint — /users/login

- **Method:** POST
- **Path:** `/users/login`

## Description
- Authenticate a user and return a JWT token plus the user object (password removed).

## Request body
- `email` (string) — required, must be a valid email
- `password` (string) — required, minimum 6 characters

Example request JSON:

```json
{
  "email": "test02@email.com",
  "password": "test_password"
}
```

## Responses
- `200 OK` — success. Returns `{ token, user }` where `user` does not include the `password` field.

Example success response (200):

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "60c72b2f9b1e8a5f4c8e4b7a",
    "fullName": { "firstName": "Jane", "lastName": "Doe" },
    "email": "jane.doe@example.com",
    "socketId": null
  }
}
```

- `400 Bad Request` — validation errors. Response contains `errors` array from `express-validator`.
- `401 Unauthorized` — invalid credentials.
- `500 Internal Server Error` — unexpected server error.

## Notes
- The route relies on `express-validator` for input validation; the controller reads validation results via `validationResult(req)`.
- The controller must not return the hashed password in responses. If the service selects `+password` for verification, the controller should remove `password` before sending the user object.
- The server must be running on the port you're calling (check for port conflicts like `EADDRINUSE`).

## Profile Endpoint — /users/profile

- **Method:** GET
- **Path:** `/users/profile`
- **Description:** Returns the currently authenticated user's profile. Requires a valid JWT token via cookie (`token`) or `Authorization: Bearer <token>` header.

Success response (200):

```json
{
  "user": { /* authenticated user object */ }
}
```

Error responses:
- `401 Unauthorized` — when token is missing, invalid, expired, or blacklisted.

Notes:
- The route uses `authMiddleware.authUser` which verifies the token, checks the token blacklist, and attaches the user document to `req.user`.
- Ensure the client sends the cookie or Authorization header when calling this endpoint.

## Logout Endpoint — /users/logout

- **Method:** GET
- **Path:** `/users/logout`
- **Description:** Logs out the authenticated user by clearing the `token` cookie and adding the token to a blacklist collection.

Success response (200):

```json
{
  "message": "Logged out successfully"
}
```

Error responses:
- `401 Unauthorized` — when token is missing, invalid, expired, or already blacklisted.

Notes:
- The controller clears the `token` cookie and stores the token in `blacklistTokenModel` to prevent reuse.
- The route is protected by `authMiddleware.authUser` to ensure only authenticated users can log out.

## Register — /captains/register

- **Method:** POST
- **Path:** `/captains/register`

Description:
- Create a new captain (driver) account. Validates the request body, hashes the password, stores the captain document, and returns a JWT token plus the created captain object (password not included by default).

Request body (JSON):
- `fullName` (object) — preferred; `fullname` is also accepted (normalization middleware supports both)
  - `firstName` (string) — required, minimum 2 characters
  - `lastName` (string) — optional
- `email` (string) — required, must be a valid email
- `password` (string) — required, minimum 6 characters
- `vehicles` (object) — accepted as `vehicles` or `vehical` (normalized)
  - `color` (string) — required
  - `plate` (string) — required, unique
  - `capacity` (number) — required, integer >= 1
  - `vehicleType` (string) — required, one of `car`, `motorcycle`, `auto-rickshaw`

Example request (accepted by the API):

```json
{
  "fullName": { "firstName": "John", "lastName": "Doe" },
  "email": "john.captain@example.com",
  "password": "strongPassword123",
  "vehicles": { "color": "blue", "plate": "MH 20 PR 1240", "capacity": 3, "vehicleType": "car" }
}
```

Notes on accepted variants:
- The route normalizes `fullname` → `fullName` and `vehical` → `vehicles`, and `vehicalType` → `vehicleType`, so clients sending those misspellings or different casing will still work.
- The model stores the name under `fullname` (lowercase) in the database; the API returns the stored document which includes the `fullname` object.

Responses / Status codes:
- `201 Created` — captain created successfully. Returns `{ token, captain }` where `captain` omits the password field.
- `400 Bad Request` — validation errors (express-validator). Response contains an `errors` array with details.
- `409 Conflict` — duplicate email or plate (unique constraint violation from the database).
- `500 Internal Server Error` — unexpected server error.

See also:
- Route: [routes/captain.routes.js](routes/captain.routes.js)
- Controller: [controllers/captain.controller.js](controllers/captain.controller.js)
- Service: [services/captain.service.js](services/captain.service.js)
- Model: [models/captain.model.js](models/captain.model.js)

## Captain Login Endpoint — /captains/login

- **Method:** POST
- **Path:** `/captains/login`

### Description
- Authenticate a captain and return a JWT token plus the captain object (password must not be returned).

### Request body
- `email` (string) — required, must be a valid email
- `password` (string) — required

Example request JSON:

```json
{
  "email": "captain@example.com",
  "password": "strongPassword123"
}
```

### Responses
- `200 OK` — success. Returns `{ token, captain }` and sets a `token` cookie. The `captain` object should NOT include the hashed `password` field.

Example success response (200):

```json
{
  "token": "<jwt-token>",
  "captain": {
    "_id": "60c72b2f9b1e8a5f4c8e4b7a",
    "fullName": { "firstName": "John", "lastName": "Doe" },
    "email": "john.captain@example.com",
    "vehicles": { "color": "blue", "plate": "MH 20 PR 1240", "capacity": 3, "vehicleType": "car" }
  }
}
```

- `400 Bad Request` — validation errors (express-validator).
- `401 Unauthorized` — invalid credentials.
- `500 Internal Server Error` — unexpected server error.

Notes:
- The route uses `express-validator` for validation. For credential checks the controller may select `+password` from the DB; ensure the `password` field is removed before sending the response.

## Captain Profile Endpoint — /captains/profile

- **Method:** GET
- **Path:** `/captains/profile`

### Description
- Returns the currently authenticated captain's profile. Requires a valid JWT token provided via cookie (`token`) or `Authorization: Bearer <token>` header.

Success response (200):

```json
{
  "captain": { /* authenticated captain object without password */ }
}
```

Error responses:
- `401 Unauthorized` — when token is missing, invalid, expired, or blacklisted.

Notes:
- The route is protected by `authMiddleware.authCaptain`, which verifies the token, checks the blacklist, and attaches the captain document to `req.captain`.

## Captain Logout Endpoint — /captains/logout

- **Method:** GET
- **Path:** `/captains/logout`

### Description
- Logs out the authenticated captain by clearing the `token` cookie and adding the token to the blacklist collection so it cannot be reused.

Success response (200):

```json
{
  "message": "Logged out successfully"
}
```

Error responses:
- `401 Unauthorized` — when token is missing, invalid, expired, or already blacklisted.

Notes:
- The controller clears the `token` cookie and stores the token in `blacklistTokenModel` to prevent reuse. The route is protected by `authMiddleware.authCaptain`.

