/* eslint-disable no-console */
import express from 'express';
import router from './routes.js';

// Initialize express app
const app = express();

// Port Configuration
const port = 9000;

// The middleware to enable Express to understand the body in JSON format
app.use(express.json());

// Define routes
app.use('/', router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
