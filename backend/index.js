require('dotenv').config();

// Imports the Express framework, which is used to build web applications and APIs.
const express = require('express');
const bodyParser = require('body-parser');
// Imports the cors middleware, which allows you to enable Cross-Origin Resource Sharing (CORS). This is useful for enabling your API to be accessed by web pages hosted on different domains.
const cors = require('cors');
// Imports the routes module from a local file (./routes). This typically contains the application's routing logic.
const routes = require('./routes');

// Creates an instance of an Express application.
const app = express();

// Adds the cors middleware to the application, enabling CORS for all routes.
app.use(cors());
// Adds the bodyParser middleware to parse incoming JSON requests and make the data available in req.body.
app.use(bodyParser.json());
// Mounts the routes module at the /api path. This means that any routes defined in the routes module will be accessible at the /api endpoint (e.g., /api/someRoute).
app.use('/api', routes);

// Sets the port number on which the server will listen. It first checks if a port 
// number is defined in the environment variables (process.env.PORT), otherwise, it defaults to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
