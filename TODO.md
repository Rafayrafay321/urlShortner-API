# Project Improvement TODO List

This document outlines the tasks to make this URL shortener project industry-ready. The tasks are divided into categories, each with specific subtasks.

---

## 1. 🚀 Core Features

### 1.1. URL Redirection

- [ ] **Create a new controller `src/controllers/url/redirectUrl.ts`**
  - [ ] It should take a `shortUrl` from the request parameters.
  - [ ] Find the corresponding `originalUrl` in the `Url` collection.
  - [ ] If found, increment the `clicks` count for the URL.
  - [ ] Redirect the user to the `originalUrl` with a `302 Found` status.
  - [ ] If not found, respond with a `404 Not Found` error.
- [ ] **Create a new route for redirection**
  - [ ] Add a route `/:shortUrl` to `src/routes/url.ts` that uses the new `redirectUrl` controller.
  - [ ] Make sure this is the last route to avoid conflicts with other routes like `/auth`. Consider creating a dedicated root-level route file for it.

### 1.2. URL Management

- [ ] **Implement URL Deletion**
  - [ ] Create a controller to delete a URL by its ID.
  - [ ] Add a `DELETE /url/:id` route, protected by `authMiddleware`.
  - [ ] Ensure a user can only delete their own URLs.
- [ ] **Implement URL Listing**
  - [ ] Create a controller to list all URLs for the authenticated user.
  - [ ] Add a `GET /url/my-urls` route, protected by `authMiddleware`.
- [ ] **(Optional) Implement URL Editing**
  - [ ] Create a controller to update the `originalUrl` of a short URL.
  - [ ] Add a `PATCH /url/:id` route.

### 1.3. User Features

- [ ] **Implement "Refresh Token" Endpoint**
  - [ ] Create a controller that takes a `refreshToken` from the cookies.
  - [ ] Verify the refresh token.
  - [ ] If valid, issue a new `accessToken`.
  - [ ] Add a `POST /auth/refresh-token` route.
  - [ ] Implement the `revokeRefreshToken` function in `src/lib/authentication.ts` that is called by `logout`. It should find the user by the refresh token and set their `refreshTokenStatus` to 'revoked' or nullify the token.

---

## 2. 🛡️ Security & Robustness

### 2.1. Refine Rate Limiting

- [ ] **Apply Rate Limiting to the new redirection route** to prevent abuse.
- [ ] Consider making the rate limit values configurable via environment variables.

### 2.2. Enhance Input Validation

- [ ] **Add validation for URL ID parameters** (e.g., `isMongoId()`) in the new URL management routes.
- [ ] Ensure all controllers that receive input use the `validationError` middleware.

### 2.3. Production Hardening

- [ ] **Conditional Mongoose Debugging**: In `src/lib/mongoose.ts`, only set `mongoose.set('debug', true);` if `config.NODE_ENV === 'development'`.
- [ ] **Secure Cookies**: In `src/controllers/auth/login.ts`, ensure the `secure` flag for cookies is strictly `true` in production. It's already set, but double-check the logic. `httpOnly: config.NODE_ENV === 'production'` in `logout.ts` is a good example, apply it consistently.

---

## 3. 🛠️ Code Quality & Developer Experience

### 3.1. Implement Comprehensive Logging

- [ ] **Complete Winston Setup**: Finish the Winston logger implementation in `src/lib/winston.ts`.
  - [ ] Configure it to log to the console in development.
  - [ ] (Optional) Configure it to log to a file or a logging service in production. The Logtail setup is a good start if you wish to use it.
- [ ] **Replace All `console.log`/`console.error`**: Go through the project and replace all `console.*` calls with your new logger.

### 3.2. Standardize Error Handling

- [ ] **Create a Global Error Handler**: Implement a global error-handling middleware that catches all errors.
  - [ ] This middleware should be the last one added with `server.use()`.
  - [ ] It should send a standardized JSON error response.
- [ ] **Use the `AppError` Class**: Refactor the code to `throw new AppError(...)` instead of sending error responses directly from controllers. The global error handler will catch these.

### 3.3. Code Cleanup

- [ ] **Fix Typos**: Correct typos like `attemps` -> `attempts` and `Sever Error` -> `Server Error` in `createUrl.ts`.
- [ ] **Improve ESLint**: Enhance `eslint.config.mjs` with stricter rules, like ordering imports.
- [ ] **Add `build` script to `package.json`**: ` "build": "tsc"`.

---

## 4. 🧪 Testing

### 4.1. Setup Testing Framework

- [ ] **Install and configure a test runner** like `Jest` or `Vitest`.
  - `npm install -D jest @types/jest ts-jest`
  - Create a `jest.config.js` file.
- [ ] **Add a `test` script** to `package.json`.

### 4.2. Write Tests

- [ ] **Unit Tests**:
  - [ ] Write tests for utility functions in `src/lib` (e.g., `generateUrl`, `jwt`, `password`).
- [ ] **Integration Tests**:
  - [ ] Write tests for the API endpoints (auth, URL creation, redirection). This will involve setting up a test database.

---

## 5. 📚 Documentation

### 5.1. API Documentation

- [ ] **Add API documentation.** A good option is to use Swagger/OpenAPI.
  - [ ] You can use libraries like `swagger-jsdoc` and `swagger-ui-express` to auto-generate docs from JSDoc comments in your route files.
- [ ] **Add JSDoc comments** to your controllers and routes explaining what they do, their parameters, and what they return.

### 5.2. Project README

- [ ] **Improve `README.md`** with:
  - [ ] Detailed setup instructions.
  - [ ] Environment variable guide (`.env.example`).
  - [ ] A summary of available API endpoints.

---

## 6. ☁️ DevOps

### 6.1. Containerization

- [ ] **Create a `Dockerfile`** for building a production-ready container image for the application.
- [ ] **Add a `.dockerignore` file** to exclude `node_modules` and other unnecessary files from the image.

### 6.2. Continuous Integration

- [ ] **Set up a CI pipeline** (e.g., using GitHub Actions).
  - [ ] Create a `.github/workflows/ci.yml` file.
  - [ ] The pipeline should run on every push/pull request to the `main` branch.
  - [ ] It should run linting, testing, and building to ensure code quality.

<!-- Raw instructions.. -->

Plans for version 2.
Your project is already quite functional, but here are some features you could add to take it to the next level and make it a more complete portfolio
piece:

- Custom Short URLs: Allow users to choose their own custom alias for a URL (e.g., my.app/my-custom-link).
- Analytics Dashboard: Track the number of clicks on each short URL. You could also log timestamps, user agents, referrers, and geographic location for
  each click and present this data on a simple dashboard.
- QR Code Generation: For each shortened URL, generate a QR code that users can download.
- User API Keys: Allow users to generate their own API keys so they can use your URL shortening service from their own applications.
- - Link Expiration: Add an option to have a link automatically expire after a certain date or a certain number of clicks.
- Password-Protected Links: Require a password to be entered before redirecting to the original URL for sensitive links.

<!-- Testing PLAN -->

> 1.  Unit Tests (/lib directory)

We'll create test files for each of these to validate their logic in isolation.

- `lib/jwt.ts`:
  - Test signJwt: Ensure it returns a token string for a given payload.
  - Test verifyJwt: Test with a valid token, an invalid token, and an expired token.
- `lib/password.ts`:
  - Test hashPassword: Ensure it returns a hash different from the input.
  - Test comparePassword: Test with both correct and incorrect passwords.
- `lib/urlGenerator.ts`:
  - Test generateUrl: Ensure it returns a string of the expected format/length.

1. Integration Tests (/src/**tests**)

We will expand your auth.test.ts and create a new url.test.ts.

- `auth.test.ts` (Enhancements)
  - Login:
    - Add a test for login with an incorrect password (should return 401 Unauthorized).
    - Add a test for a non-existent user (should return 404 Not Found or 401).
  - Logout:
    - Add a describe block for POST /auth/logout.
    - Test that it successfully clears the accesstoken cookie.
  - Refresh Token:
    - Add a describe block for GET /auth/refresh.
    - Test that a new accesstoken is issued if a valid refresh token is present.

- `url.test.ts` (New File)
  - Setup: Use the same beforeAll, afterAll, afterEach structure. You'll need to register and log in a user to get an auth token for protected routes.
  - `POST /url/create`:
    - Test successful URL creation (201).
    - Test for invalid URL format (400).
    - Test without authentication (401).
  - `GET /url/list`:
    - Test that it returns a list of URLs for the authenticated user.
    - Test without authentication (401).
  - `PATCH /url/update/:id`:
    - Test successful update (200).
    - Test updating a URL that doesn't exist (404).
    - Test a user trying to update another user's URL (403 Forbidden/404 Not Found).
  - `DELETE /url/delete/:id`:
    - Test successful deletion (200 or 204).
    - Test deleting a URL that doesn't exist (404).
    - Test a user trying to delete another user's URL (403/404).

- `redirect.test.ts` (New File)
  - `GET /:shortId`:
    - Test that a valid shortId redirects (302) to the correct original URL.
    - Test that an invalid or non-existent shortId returns a 404.

This plan covers all the core functionality of your MVP. When this is complete, your application will be very well-tested and ready for the next steps.

✓ Analyze existing tests to understand the current setup.
✓ Create a comprehensive test plan.
» Implement unit tests for `lib/password.ts`.
☐ Implement unit tests for `lib/jwt.ts`.
☐ Implement unit tests for `lib/urlGenerator.ts`.
☐ Enhance integration tests for authentication endpoints.
☐ Implement integration tests for URL management endpoints.
☐ Implement integration tests for the redirect endpoint.
☐ Guide on Dockerizing the application.
☐ Guide on setting up a CI/CD pipeline.

Of course. It's great that you're thinking about expanding your test coverage. Based on your project structure, here is a logical list of which tests to
write next, from highest to lowest priority.

Priority 1: URL Controller Logic (Integration Tests)

You have controller files for creating, deleting, listing, and updating URLs, but no integration tests for them. This is the most important area to test
next.

File to create: src/**tests**/url.test.ts

Instructions:

1.  Setup:
    - Structure the file like auth.test.ts, using supertest to make requests and db.handler to manage the database state.
    - You will need to simulate a logged-in user to test these protected routes. In a beforeEach or at the start of your tests, register and log in a
      user to get their auth token.

2.  Test Case Instructions (`describe('/api/url', ...)`):
    - `POST /api/url` (Create URL):
      - Write a test for a successful creation (201 Created). Assert that the response body contains the new URL object.
      - Write a test for an invalid URL (e.g., "not-a-url"). Expect a 400 Bad Request.
      - Write a test that tries to create a URL without being authenticated. Expect a 401 Unauthorized.
    - `GET /api/url` (List URLs):
      - Write a test where you first create a few URLs, then make a GET request. Assert that the response body is an array containing the URLs you
        created.
      - Write a test for a user who has no URLs. Expect an empty array.
      - Write a test that tries to list URLs without being authenticated. Expect a 401 Unauthorized.
    - `DELETE /api/url/:id` (Delete URL):
      - Write a test where you create a URL, get its ID, then send a DELETE request. Expect a 200 OK or 204 No Content. Verify it's gone by trying to
        list it again.
      - Write a test where a user tries to delete a URL belonging to another user. Expect a 401 Unauthorized or 404 Not Found.

---

Priority 2: Redirect Logic (Integration Test)

This is a core feature of your application.

File to create: src/**tests**/redirect.test.ts

Instructions:

1.  `GET /:shortUrl`:
    - Write a test for a successful redirect.
      - Arrange: First, create a short URL in your database (either via the API or directly).
      - Act: Make a GET request to /:shortUrl using supertest.
      - Assert: Expect a 302 Found status code. Assert that the Location header in the response is equal to the original, long URL.
    - Write a test for a shortUrl that does not exist. Expect a 404 Not Found status.

---

Priority 3: Middleware (Unit Tests)

You have several middleware functions that can be unit-tested in isolation.

File to create: src/**tests**/middleware/authMiddleware.test.ts

Instructions:

1.  Test the Authentication Middleware (`authMiddleware`):
    - This middleware likely checks for a JWT and attaches the user to the request object.
    - Setup: You will need to mock the req, res, and next objects. vi.fn() is perfect for this.
    - Test Case 1 (Successful Auth):
      - Create a valid auth token.
      - Set it in the mocked request's headers/cookies.
      - Call authMiddleware(req, res, next).
      - Assert that next() was called without any arguments.
      - Assert that req.user was successfully attached.
    - Test Case 2 (No Token):
      - Call the middleware with no token in the request.
      - Assert that next() was called with an AppError (or however you handle auth errors). Assert the error has a 401 status code.
