// Import the express library, which is a popular framework for building web servers in Node.js
const express = require('express');
// Import the path module, which helps in handling and transforming file paths
const path = require('path');

// Create an instance of an express application
const app = express();

// Define the port the server will run on. 
// It will use the PORT environment variable provided by Railway, or default to 3000 if it's not set.
const PORT = process.env.PORT || 3000;

// This is a crucial middleware. It tells Express to serve static files 
// (like HTML, CSS, client-side JS) from the 'public' directory.
// path.join(__dirname, 'public') creates an absolute path to the 'public' folder.
app.use(express.static(path.join(__dirname, 'public')));

// Set up a "catch-all" route. If no other route matches, this will send the index.html file.
// This is useful for single-page applications.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and make it listen for incoming requests on the specified port.
// The callback function will log a message to the console once the server is running.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
