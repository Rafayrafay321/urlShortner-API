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

High-Level Plan: Implementing Logging with Winston

1. Configure the Winston Logger (`src/lib/winston.ts`)

This file will be the heart of your logging setup. It's where you'll create and configure your logger instance.

- Objective: Create a centralized logger that you can import and use anywhere in your app.
- What to do:
  1.  Import necessary modules from the winston library (createLogger, format, transports).
  2.  Define Log Levels: Think about the different levels of information you want to log (e.g., error, warn, info, http, debug). Winston has these
      built-in.
  3.  Choose Transports: A transport is where your logs will be sent. A good start is to use:
      - transports.Console: To print logs to your terminal. This is great for development.
      - transports.File: To save logs to files. You should create separate files for errors (error.log) and for all other logs (combined.log).
  4.  Define a Format: How should each log message look? Winston's format object is powerful. Combine formats using format.combine() to include:
      - A timestamp (format.timestamp()).
      - Colorization for readability in the console (format.colorize()).
      - A simple, readable print format (format.printf()).
  5.  Create and Export the Logger: Use createLogger() with your defined levels, transports, and format. Export this logger instance as the default
      module.

2. Integrate HTTP Request Logging (Middleware)

You need a way to automatically log every incoming HTTP request. The best way to do this is with middleware.

- Objective: Log key information for every API request, like the method, URL, status code, and response time.
- What to do:
  1.  Choose a Tool: The morgan library is excellent for this and is designed to work with Winston. First, add it to your project.
  2.  Create a Middleware File: You could create a new file, perhaps src/middleware/loggingMiddleware.ts.
  3.  Connect `morgan` to `winston`: morgan can take a "stream" as an option. You can create a stream object that directs morgan's output to your
      Winston logger's http level. This elegantly integrates the two libraries.
  4.  Apply the Middleware: In src/server.ts, import your new logging middleware and add it to your Express application using app.use(). It should be
      one of the very first middleware you apply.

3. Implement Centralized Error Logging (`src/middleware/errorHandler.ts`)

Your existing errorHandler.ts is the perfect place to ensure all application errors are logged.

- Objective: Whenever your application throws an error and it's caught by your error handler, log the important details.
- What to do:
  1.  Import your logger into src/middleware/errorHandler.ts.
  2.  Log the Error: Inside the error handling function, before you send a response to the client, use your logger to record the error. Log the
      err.message and perhaps the err.stack for debugging purposes. Use the error log level here.

4. Add Custom Logging in Your Business Logic (Controllers & Services)

For more specific insights, you'll want to add manual log statements in important parts of your code.

- Objective: Log key events in your application's logic, such as a user successfully registering or a URL being created.
- What to do:
  1.  Import your logger into any controller or service file where you want to add logging (e.g., src/controllers/auth/register.ts).
  2.  Add Log Statements: At key points in your functions, add calls to your logger. For example:
      - logger.info('User registered successfully: user.id')
      - logger.warn('Failed login attempt for user: user.email')
      - logger.debug('Running database query: ...')

By following this plan, you will have a powerful and well-structured logging system. You'll learn how to configure Winston, how to automatically log
requests, how to handle errors, and how to add specific, meaningful logs to your application. Let me know if you'd like me to elaborate on any of these
steps
