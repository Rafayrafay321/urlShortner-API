he Environment Variable Audit


   * `✓` Create `.env.example`: This is already DONE. We created this file in a previous step.
   * Instruction Plan for Validation:
       1. Test the Crash: In your terminal, temporarily rename your .env file: mv .env .env.bak.
       2. Try to start your application: docker-compose up. Observe how it crashes. It will likely be an unclear error related to an undefined variable.
       3. Stop the application (Ctrl+C) and rename your file back: mv .env.bak .env.
       4. Implement Graceful Failure: Go to src/config/config.ts. At the top of the file, before the config object is defined, create a list of required
          variable names (e.g., ['PORT', 'DB_URL', 'JWT_ACCESS_SECRET', ...]). Loop through this list and check if process.env[variableName] exists. If any
          are missing, throw new Error() with a clear message like Missing required environment variables: JWT_ACCESS_SECRET. This will make the app fail
          fast with a clear, actionable error message.

  2. The Docker "Cold Start" Test


   * Instruction Plan:
       1. Nuke the Environment: In your terminal, run docker-compose down -v. This will completely remove the containers, networks, and the database data
          volume.
       2. Create an `entrypoint.sh` script: In the root of your project, create a new file named entrypoint.sh.
       3. Add Logic to the Script: Add the following lines to entrypoint.sh. This script tells the container to first run migrations and then start the
          application.


   1         #!/bin/sh
   2         echo "Running database migrations..."
   3         npx prisma migrate deploy
   4
   5         echo "Starting the application..."
   6         exec "$@"
       4. Make the Script Executable: In your terminal, run chmod +x entrypoint.sh.
       5. Update your `Dockerfile`: Open your Dockerfile. Find the CMD instruction at the end and replace it with this ENTRYPOINT instruction:
   1         ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
   2         CMD ["npm", "run", "start"]
          (Note: The path in `ENTRYPOINT` assumes your `WORKDIR` is `/usr/src/app`. Adjust if necessary.)
       6. Run the Test: Now, run docker-compose up --build. Observe the logs. You should see the "Running database migrations..." message before the
          application starts.


  3. Production Build Optimization (Multi-Stage Build)


   * Instruction Plan:
       1. Modify Your `Dockerfile`: Restructure your entire Dockerfile to use two stages.
       2. Stage 1 - The "Builder":
           * Start with FROM node:18-alpine AS builder.
           * In this stage, copy your package*.json files, run npm install (this will include devDependencies), copy all your source code, and run npm run
             build.
       3. Stage 2 - The "Runtime":
           * Start a new stage with FROM node:18-alpine.
           * In this stage, copy package*.json again, but this time run npm install --only=production to get only the necessary production dependencies.
           * Use COPY --from=builder /path/to/your/dist /app/dist to copy only the compiled JavaScript from the "builder" stage.
           * Your ENTRYPOINT and CMD instructions from the previous step will go at the end of this stage.

  4. Database Seeding & Migration Strategy


   * Instruction Plan:
       1. Create a Seed File: In your prisma/ directory, create a new file named seed.ts.
       2. Write the Seed Logic: Inside seed.ts, import your Prisma client. Write an async function that uses prisma.user.create() to create a test user.
          Remember to hash the password for this user using your password utility. You can also create a test API key.
       3. Configure `package.json`: Open your package.json and add the following section if it's not already there. This tells Prisma how to run your seed
          script.
   1         "prisma": {
   2           "seed": "ts-node prisma/seed.ts"
   3         }
       4. Run the Seed: In your terminal, you can now run npx prisma db seed to populate your database with the test data.

  5. Error Handling & Logging


   * Instruction Plan:
       1. This is already DONE! Your project already has a global error-handling middleware (errorHandler.ts).
       2. Verify It: Use a tool like Postman or curl to send a POST request to your /api/auth/login endpoint with a malformed JSON body (e.g., missing a
          closing brace {). You should get back a clean, well-formatted JSON error, not a giant HTML stack trace.


  6. Deployment Readiness


   * Instruction Plan:
       1. Create Health Check Route: In src/routes/index.ts, create a new route: router.get('/health', ...).
       2. Create Health Check Controller: The controller for this route should be extremely simple. It should just respond with a status of 200 and a simple
          JSON object, like res.status(200).json({ status: 'ok', uptime: process.uptime() });. This confirms the server process is alive and responsive.

  7. Documentation & Final Git Tag
      Im writing this from the AWS_EC2 instace.

   * Instruction Plan:
       1. Prisma Schema Comments: Open prisma/schema.prisma. Above each model and any complex fields, add a /// comment to explain its purpose.
       2. Create a Postman Collection:
           * Using the Postman app, create and save requests for all your main endpoints (register, login, create URL, reset password, etc.).
           * Organize them into a collection.
           * Export the entire collection as a JSON file.
           * Create a new folder /docs in your project root and save the exported file there (e.g., /docs/API.postman_collection.json).
       3. Tag Your Release: Once all the above steps are completed, committed, and pushed, run these commands to officially tag your v1.0.0 release:


   1         git tag -a v1.0.0 -m "Initial production-ready release"
   2         git push origin v1.0.0
