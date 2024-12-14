// Import necessary modules
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

// Initialize the Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());  // To parse JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));  // To parse URL-encoded data
app.use(express.static(path.join(path.resolve(), 'public')));  // Serve static files from the 'public' directory

// Example route to check the server is running
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// You can add more routes for your API or web pages
// Example: A simple API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'This is a test route.' });
});

// Export the app so it can be used in your server file
export default app;
