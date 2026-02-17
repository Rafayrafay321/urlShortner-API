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
- Analytics Dashboard: Track the number of clicks on each short URL. You could also log timestamps, user agents, referrers, and geographic location for each click and present this data on a simple dashboard.
- QR Code Generation: For each shortened URL, generate a QR code that users can download.
- User API Keys: Allow users to generate their own API keys so they can use your URL shortening service from their own applications.
- - Link Expiration: Add an option to have a link automatically expire after a certain date or a certain number of clicks.
- Password-Protected Links: Require a password to be entered before redirecting to the original URL for sensitive links.

☐ Review and update the database schema (src/models/url.ts and create a new src/models/click.ts) to include fields for custom aliases, click counts,
expiration dates, maximum clicks, passwords, and QR code storage. Also, update the User model (src/models/user.ts) for API keys.
☐ Implement custom short URL logic: update src/controllers/url/createUrl.ts to handle user-defined aliases and ensure their uniqueness.
☐ Develop QR code generation utility: create a new utility in src/lib to generate QR codes and integrate it into src/controllers/url/createUrl.ts and
potentially src/controllers/url/updateUrl.ts.
☐ Enhance URL redirection (src/controllers/url/redirectUrl.ts) to include logic for password protection, link expiration (by date and click count), and
incrementing the click counter.
☐ Create a new analytics logging service (e.g., src/lib/analytics.ts) to record detailed click data (timestamps, user agents, referrers, IP addresses) and
integrate it into src/controllers/url/redirectUrl.ts.
☐ Design and implement API endpoints and logic for user API key generation and management (e.g., new routes in src/routes/auth.ts or a new auth
controller).
☐ Develop an authentication middleware (e.g., enhance src/middleware/authMiddleware.ts or create a new one) to validate user API keys for protected
routes.
☐ Build the analytics dashboard API: create new controllers and routes (e.g., src/controllers/analytics/getAnalytics.ts and src/routes/analytics.ts) to
retrieve and aggregate click data for display.
☐ Update URL update and listing functionalities (src/controllers/url/updateUrl.ts and src/controllers/url/listUrls.ts) to support the new fields and
features.
☐ Add comprehensive validation for all new input fields in URL creation and update (e.g., in src/validators/commonValidators.ts or new urlValidators.ts).
☐ Implement error handling for all new features, such as invalid custom aliases, expired links, incorrect passwords, or invalid API keys.
☐ Write unit and integration tests for all new features and modifications to ensure robustness and correctness.
☐ Update API documentation to reflect all new endpoints, request/response formats, and features.


 Migration Plan: express-validator to Zod

  This plan follows an incremental approach, allowing you to migrate your application one route at a time with minimal disruption.

  Phase 1: Setup and Foundation


   1. Install Zod: Add Zod to your project as a dependency.
   1     npm install zod


   2. Create a Reusable Validation Middleware: This is the most crucial step. You will create a new middleware function that can be used with any Zod schema
      for any route. This prevents code duplication.
       * This middleware will be a higher-order function. It will take a Zod schema as an argument and return an Express middleware function ((req, res,
         next) => { ... }).
       * Inside the returned middleware, you will use Zod's safeParse method to validate req.body, req.params, and req.query against the provided schema.
       * If validation fails, the middleware should catch the error and send a 400 Bad Request response. The response body should contain the structured
         validation errors from Zod's error object (error.issues).
       * If validation succeeds, the middleware should call next() to pass control to the next function in the chain (your controller).

  Phase 2: Migrating Your First Route (e.g., User Registration)


   3. Target the Registration Route: We'll start with the user registration endpoint (POST /auth/register), as it's a good example with multiple fields.


   4. Define a Zod Schema:
       * Create a new file, for example src/validators/authZodValidators.ts.
       * In this file, define a Zod schema for the registration request body. This schema will define the expected shape and types for username, email, and
         password.
       * Use Zod's features to define validation rules, such as z.string().min(3), z.string().email(), etc. This replaces the body('username').isLength({
         min: 3 }) style from express-validator.


   5. Update the Route:
       * Open src/routes/auth.ts.
       * Import your new Zod validation middleware and the registration schema you just created.
       * Find the router.post('/register', ...) line.
       * Remove the existing express-validator middleware array (registerValidator).
       * Replace it with your new Zod validation middleware, passing the registration schema to it. The result will look something like
         router.post('/register', validate(registrationSchema), registerUser).

  Phase 3: Verification and Rollout


   6. Test the Migrated Route:
       * Run your application.
       * Use a tool like Postman or curl to send requests to your POST /auth/register endpoint.
       * Test failure cases: Send requests with missing fields, incorrect data types, or values that don't meet your validation rules (e.g., a password
         that's too short). Verify that you receive a 400 error with a well-formatted JSON response detailing the validation issues.
       * Test success cases: Send a valid request and verify that the user is created successfully.


   7. Repeat the Process: Once you are confident with your first migrated route, repeat steps 4-6 for the other routes in your application (login,
      createUrl, updateUrl, etc.).
       * For each route, define a corresponding Zod schema.
       * Replace the old express-validator middleware with your reusable Zod validation middleware.
       * Test each route thoroughly.

  Phase 4: Cleanup


   8. Remove `express-validator`: Once all of your routes have been migrated to Zod and you've confirmed everything works, you can uninstall
      express-validator.
   1     npm uninstall express-validator


   9. Delete Old Validator Files: You can now safely delete the old express-validator files (e.g., src/validators/authValidators.ts).


  By following this plan, you will have a more modern, type-safe, and maintainable validation layer in your application. Good luck with the execution
