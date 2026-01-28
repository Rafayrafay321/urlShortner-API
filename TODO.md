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
