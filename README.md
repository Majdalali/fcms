# System Overview

This system is designed to be easily set up and used by different faculties. Here's the breakdown:

## Frontend

Built with **Vue.js**, a popular JavaScript framework, providing a user-friendly and interactive interface.

## Backend

Powered by **Express.js**, a Node.js framework, handling data, logic, and communication with the frontend.
System Structure

## System Structure

- frontend (Contains Vue.js frontend code)
- api (Contains Express.js backend code)

## Setup Instructions

1.  **Firebase Setup**

- Create a free Firebase account at https://firebase.google.com/
- Start a new Firebase project.
- Navigate to Project settings (gear icon next to "Project Overview").
- Go to the Service accounts tab.
- Click "Generate new private key" and download the JSON file.
- Rename this file to serviceAccountKey.json and place it in the system/api/src/config folder.

2. **Frontend Setup**

- **Prerequisites:** Make sure you have Node.js and npm (or yarn) installed: https://nodejs.org/
- Navigate to the 'frontend' folder:

```Bash
cd system/frontend
```

- Install dependencies:

```Bash
npm install
```

- Build the Vue project:

```Bash
npm run build
```

3. **Backend Setup and Integration**

- Copy Frontend Build Files: After the build, a `dist` folder will be created within the `frontend` directory. Copy the contents of the `dist` folder into the `system/api/public` folder.

4. **Deploy Backend**

- The backend (`system/api`) can be deployed to a server of your choice that supports Node.js (popular options include Heroku, AWS, DigitalOcean, etc.).
- Deployment instructions will vary depending on your chosen hosting option.

## Additional Notes

- For detailed help with Vue setup, refer to the Vue.js documentation: https://vuejs.org/
- For guidance on Express, refer to the Express.js documentation: https://expressjs.com/

## Need More Help?

If you encounter any issues or have questions, please reach out to [ ] at [ ].
