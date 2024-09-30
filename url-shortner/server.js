const express = require('express');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid').v4;

const app = express();

// Middleware for serving static files and parsing JSON bodies
app.use(express.static(__dirname));
app.use(express.json());

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to create a short URL
app.post('/shorturl', (req, res) => {
    const { longUrl } = req.body;

    // Log the received long URL
    console.log("Received long URL:", longUrl);

    // Generate a unique ID for the short URL
    const id = uuidv4();
    console.log("Generated short URL ID:", id);

    // Create an object to store the mapping
    const newLink = { id, longUrl };

    // Read the existing links from the file
    fs.readFile('links.json', 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Server error: Unable to read file.");
        }

        try {
            // Parse the JSON data into an array
            const links = JSON.parse(data);

            // Add the new link object
            links.push(newLink);

            // Write the updated links array back to the file
            fs.writeFile('links.json', JSON.stringify(links, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error("Error writing to file:", err);
                    return res.status(500).send("Server error: Unable to save data.");
                }

                // Respond with the generated short URL
                res.json({ shortUrl: id });
            });

        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return res.status(500).send("Server error: Corrupted data.");
        }
    });
});

// Endpoint to redirect based on short URL ID
app.get('/:id', (req, res) => {
    const { id } = req.params;
    console.log("Request to redirect for ID:", id);

    // Read the links file to find the corresponding long URL
    fs.readFile('links.json', 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Server error: Unable to read file.");
        }

        try {
            // Parse the file content into an array
            const links = JSON.parse(data);

            // Find the link with the matching ID
            const link = links.find(link => link.id === id);

            if (link) {
                // Redirect to the long URL if found
                res.redirect(link.longUrl);
            } else {
                // Respond with a 404 error if no link is found
                res.status(404).send("Short URL not found.");
            }
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return res.status(500).send("Server error: Corrupted data.");
        }
    });
});

// Fallback route for invalid routes
app.get('*', (req, res) => {
    res.status(404).send("Page not found.");
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
