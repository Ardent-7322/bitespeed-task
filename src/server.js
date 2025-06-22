// Load all values from the .env file (like DB connection, port)
import dotenv from 'dotenv';
dotenv.config();

// Bring in the main Express app from app.js
import app from './app.js';

// Decide which port the server should run on
const PORT = process.env.PORT || 3000;

// Start the server so it can listen for incoming requests
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
