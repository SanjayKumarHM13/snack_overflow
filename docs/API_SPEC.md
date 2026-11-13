# Snack Overflow — REST API Specification

## 1. Overview & Conventions
- **Base URL:** `http://localhost:4000/api`
- **Content-Type:** `application/json`
- **Authentication:** `snack_session` HTTP-only cookie containing a signed JWT, or `Authorization: Bearer <token>`.
- **Response Format:**
  - Success responses return JSON objects containing data payloads.
  - Error responses strictly adhere to the unified error contract:
    ```json
    {
      "error": {
        "code": "STRING_ERROR_CODE",
        "message": "Human-readable description of the error"
      }
    }
    ```

---

## 2. Standard HTTP Status Codes

| Code | Status | Meaning |
| :--- | :--- | :--- |
| **200** | OK | Request succeeded |
| **201** | Created | Resource created successfully |
| **400** | Bad Request | Validation error or malformed request body |
| **401** | Unauthorized | Authentication token missing or invalid |
| **403** | Forbidden | Insufficient permissions (e.g. member accessing admin resource) or CSRF origin mismatch |
| **404** | Not Found | Target resource does not exist |
| **409** | Conflict | Insufficient stock, race-condition conflict, or duplicate vote |
| **500** | Internal Error | Unexpected server error (sanitized in production) |

---

## 3. Endpoints

### A. Authentication & Session Management

#### `GET /api/auth/register-status`
Returns whether public member sign-up is open or restricted by administrator configuration.
- **Access:** Public
- **Response (200 OK):**
  ```json
  {
    "registrationEnabled": true
  }
  ```

#### `POST /api/auth/register`
Creates a new Member account in PostgreSQL.
- **Access:** Public (Rate-limited: 5 attempts per 15 min per IP)
- **Headers:** `X-CSRF-Token: <token>`
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@company.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Account created successfully. You can now sign in.",
    "user": {
      "id": "e4b47f0e-3c58-45e6-9b57-d65fa09e3e7f",
      "name": "Jane Doe",
      "email": "jane@company.com",
      "role": "MEMBER",
      "createdAt": "2026-11-13T10:00:00.000Z"
    }
  }
  ```
- **Session Behavior:** Does not issue a session cookie or auto-login. The client redirects to `/login?registered=true` where the user authenticates explicitly.
- **Error (400 Bad Request):** Validation failure or password complexity not met.
- **Error (403 Forbidden):** Registration disabled by admin policy (`REGISTRATION_DISABLED`).
- **Error (409 Conflict):** User with this email already exists (`EMAIL_ALREADY_EXISTS`).

#### `GET /api/auth/csrf-token`
Retrieves a cryptographically signed CSRF token required for all subsequent state-changing mutations (`POST`, `PUT`, `PATCH`, `DELETE`).
- **Access:** Public / Authenticated
- **Response (200 OK):**
  ```json
  {
    "csrfToken": "4a7f8e9b-3c2d-41a5-89f1-d0b8c6e2a1b3"
  }
  ```

#### `POST /api/auth/login`
Authenticates a user, persists an active session in PostgreSQL, and sets an HTTP-only session cookie.
- **Access:** Public
- **Headers:** `X-CSRF-Token: <token>`
- **Request Body:**
  ```json
  {
    "email": "member@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "user": {
      "id": "e4b47f0e-3c58-45e6-9b57-d65fa09e3e7f",
      "name": "Member User",
      "email": "member@example.com",
      "role": "MEMBER"
    }
  }
  ```
- **Cookie Set:** `snack_session=<JWT>; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`

#### `POST /api/auth/logout`
Revokes the server-side session in PostgreSQL (`revokedAt = NOW()`) and destroys the client cookie.
- **Access:** Authenticated
- **Headers:** `X-CSRF-Token: <token>`
- **Response (200 OK):**
  ```json
  {
    "message": "Successfully logged out and session revoked"
  }
  ```

#### `GET /api/auth/me`
Retrieves the profile of the currently authenticated user.
- **Access:** Authenticated
- **Response (200 OK):**
  ```json
  {
    "user": {
      "id": "e4b47f0e-3c58-45e6-9b57-d65fa09e3e7f",
      "name": "Member User",
      "email": "member@example.com",
      "role": "MEMBER"
    }
  }
  ```

---

### B. Snacks & Catalog

#### `GET /api/snacks`
Retrieves paginated, filtered, and sorted snacks with dynamic status and vote counts.
- **Access:** Authenticated
- **Query Parameters:**
  - `category`: `SWEET | SAVOURY | DRINK | HEALTHY_ISH`
  - `status`: `STOCKED | RUNNING_LOW | GONE`
  - `search`: String (searches snack name, case-insensitive)
  - `page`: Integer (default `1`)
  - `limit`: Integer (default `10`, max `50`)
  - `sortBy`: `name | quantity | votes` (default `name`)
  - `sortOrder`: `asc | desc` (default `asc`)
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Oreo",
        "category": "SWEET",
        "quantity": 15,
        "lowStockThreshold": 5,
        "status": "STOCKED",
        "voteCount": 8,
        "hasVoted": true,
        "createdAt": "2026-11-12T10:00:00.000Z",
        "updatedAt": "2026-11-12T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 24,
      "totalPages": 3
    }
  }
  ```

#### `GET /api/snacks/:id`
Retrieves detailed information for a single snack.
- **Access:** Authenticated
- **Response (200 OK):**
  ```json
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Oreo",
    "category": "SWEET",
    "quantity": 15,
    "lowStockThreshold": 5,
    "status": "STOCKED",
    "voteCount": 8,
    "hasVoted": true
  }
  ```

#### `POST /api/snacks`
Creates a new snack item.
- **Access:** **Admin Only**
- **Request Body:**
  ```json
  {
    "name": "Roasted Almonds",
    "category": "HEALTHY_ISH",
    "quantity": 20,
    "lowStockThreshold": 5
  }
  ```
- **Response (201 Created):** Created snack entity.

#### `PATCH /api/snacks/:id`
Updates an existing snack's metadata.
- **Access:** **Admin Only**
- **Request Body:** Partial snack object (`name`, `category`, `lowStockThreshold`).
- **Response (200 OK):** Updated snack entity.

#### `DELETE /api/snacks/:id`
Deletes a snack item. Preserves historical activity entries.
- **Access:** **Admin Only**
- **Response (200 OK):** `{ "message": "Snack deleted successfully" }`

---

### C. Inventory Operations

#### `POST /api/snacks/:id/consume`
Consumes packets of a snack using atomic database row-level locking.
- **Access:** Authenticated (Member Only)
- **Headers:** 
  - `X-CSRF-Token: <token>`
  - `Idempotency-Key: <unique-uuid>` *(Optional, recommended)* — ensures request is executed exactly once across retries.
- **Request Body:**
  ```json
  {
    "amount": 1
  }
  ```
- **Response (200 OK):**
  - **Headers:** `Idempotency-Replayed: true | false`
  ```json
  {
    "message": "Snack consumed successfully",
    "snack": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Oreo",
      "quantity": 2,
      "status": "RUNNING_LOW"
    },
    "consumedAmount": 1
  }
  ```
- **Error (409 Conflict):**
  - Insufficient stock: `INSUFFICIENT_STOCK`
  - Idempotency key payload mismatch: `IDEMPOTENCY_KEY_PAYLOAD_MISMATCH`
  - Concurrent request with same key in progress: `IDEMPOTENCY_KEY_IN_PROGRESS`

#### `POST /api/snacks/:id/restock`
Adds packets to a snack and logs a restocking activity.
- **Access:** **Admin Only**
- **Headers:** `X-CSRF-Token: <token>`
- **Request Body:**
  ```json
  {
    "amount": 15
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Snack restocked successfully",
    "snack": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Oreo",
      "quantity": 17,
      "status": "STOCKED"
    },
    "restockedAmount": 15
  }
  ```

#### `POST /api/snacks/consume-basket`
Atomically consumes multiple different snacks and quantities in a single all-or-nothing transaction.
- **Access:** **Member Only**
- **Headers:**
  - `X-CSRF-Token: <token>`
  - `Idempotency-Key: <unique-uuid>` *(Optional, recommended)* — coordinates transaction outcome across retries.
- **Request Body:**
  ```json
  {
    "items": [
      { "snackId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "amount": 2 },
      { "snackId": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "amount": 1 }
    ]
  }
  ```
- **Response (200 OK):**
  - **Headers:** `Idempotency-Replayed: true | false`
  ```json
  {
    "message": "Successfully consumed 3 packet(s) across 2 snack variety(ies).",
    "totalPackets": 3,
    "items": [
      {
        "snackId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "snackName": "Oreo",
        "amount": 2,
        "remainingQuantity": 2,
        "status": "RUNNING_LOW"
      }
    ]
  }
  ```

---

### D. Real-Time Server-Sent Events (SSE)

#### `GET /api/events`
Establishes a persistent, authenticated Server-Sent Events stream for real-time inventory and voting notifications.
- **Access:** Authenticated (Cookie Session or Bearer Token)
- **Response Headers:**
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache, no-transform`
  - `Connection: keep-alive`
  - `X-Accel-Buffering: no`
- **Heartbeat:** Comment ping (`: heartbeat <timestamp>\n\n`) emitted every 20 seconds.
- **Event Stream Format:**
  ```
  event: <EventType>
  data: {"type":"<EventType>","snackId":"<id>","timestamp":"<iso-timestamp>"}
  ```
- **Supported Event Types:**
  - `CONNECTED`: Initial stream establishment confirmation.
  - `SNACK_CREATED`: A new snack was added to the pantry.
  - `SNACK_UPDATED`: A snack's name, category, or reorder threshold was changed.
  - `SNACK_DELETED`: A snack was removed from the pantry.
  - `SNACK_RESTOCKED`: An admin restocked snack packets.
  - `SNACK_CONSUMED`: A member grabbed a snack packet.
  - `BASKET_CONSUMED`: A member consumed a multi-item basket.
  - `VOTE_ADDED`: A member voted for a snack.
  - `VOTE_REMOVED`: A member withdrew a vote.
- **Security & Data Isolation:** Events only contain sanitized identifiers and timestamps. User IDs, session tokens, and private consumption logs are strictly excluded from broadcast payloads.
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Basket consumed successfully.",
    "consumedCount": 2,
    "totalPackets": 3,
    "items": [
      { "snackId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "amount": 2, "snackName": "Apple Juice", "remainingQuantity": 8 },
      { "snackId": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "amount": 1, "snackName": "Dairy Milk", "remainingQuantity": 19 }
    ]
  }
  ```
- **Error (409 Conflict):**
  ```json
  {
    "error": {
      "code": "INSUFFICIENT_STOCK",
      "message": "Insufficient stock for Apple Juice. Requested 2, but only 1 available."
    }
  }
  ```

#### `GET /api/snacks/favourites`
Retrieves all snacks currently marked as favourite by the authenticated member.
- **Access:** **Member Only**
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Apple Juice",
        "category": "DRINK",
        "quantity": 8,
        "lowStockThreshold": 5,
        "status": "STOCKED",
        "voteCount": 3,
        "hasVoted": true
      }
    ]
  }
  ```

---

### D. Voting

#### `POST /api/snacks/:id/vote`
Records a user's vote for a snack.
- **Access:** Authenticated
- **Response (201 Created):**
  ```json
  {
    "message": "Vote recorded successfully",
    "voteCount": 9,
    "hasVoted": true
  }
  ```
- **Error (409 Conflict):**
  ```json
  {
    "error": {
      "code": "DUPLICATE_VOTE",
      "message": "You have already voted for this snack."
    }
  }
  ```

#### `DELETE /api/snacks/:id/vote`
Removes a user's vote for a snack.
- **Access:** Authenticated
- **Response (200 OK):**
  ```json
  {
    "message": "Vote removed successfully",
    "voteCount": 8,
    "hasVoted": false
  }
  ```

---

### E. Dashboard & Activity

#### `GET /api/snacks/summary`
Returns aggregated analytics and highlights.
- **Access:** Authenticated
- **Response (200 OK):**
  ```json
  {
    "totalSnackTypes": 18,
    "totalPackets": 240,
    "stockedCount": 14,
    "runningLowCount": 3,
    "goneCount": 1,
    "snackOfTheWeek": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Dairy Milk",
      "category": "SWEET",
      "quantity": 20,
      "weeklyVotes": 14
    },
    "alerts": [
      {
        "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "name": "Lays",
        "quantity": 3,
        "lowStockThreshold": 5,
        "status": "RUNNING_LOW"
      }
    ],
    "recentActivities": []
  }
  ```

#### `GET /api/activities`
Retrieves paginated audit log entries across the entire organization.
- **Access:** **Admin Only**
- **Query Parameters:** `page=1&limit=20`
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
        "userId": "e4b47f0e-3c58-45e6-9b57-d65fa09e3e7f",
        "userName": "Member User",
        "snackId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "snackName": "Oreo",
        "action": "CONSUMED",
        "amount": 1,
        "createdAt": "2026-11-12T12:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 150,
      "totalPages": 8
    }
  }
  ```

#### `GET /api/activities/me`
Retrieves paginated personal consumption activity for the logged-in member.
- **Access:** **Member Only**
- **Query Parameters:** `page=1&limit=20`
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
        "userId": "e4b47f0e-3c58-45e6-9b57-d65fa09e3e7f",
        "userName": "Member User",
        "snackId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "snackName": "Apple Juice",
        "action": "CONSUMED",
        "amount": 2,
        "createdAt": "2026-11-12T16:39:16.089Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 5,
      "totalPages": 1
    }
  }
  ```
