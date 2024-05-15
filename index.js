const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer'); // Add multer for file uploads

function startServer(port = 3000, endpoint = '/data') {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false })); 

  const upload = multer({ dest: 'data' }); // Configure multer to store files in 'data'

  app.post(endpoint, upload.array('files'), (req, res) => {
    const data = req.body;
    const ipAddress = req.ip;

    // Handle data from form fields
    let output = '';
    for (const key in data) {
      output += `${key}: ${data[key]}, `;
    }
    output = output.slice(0, -2); // Remove trailing comma and space

    console.log(`IP: ${ipAddress}, Data: ${output}`);

    // Handle uploaded files
    if (req.files) {
      req.files.forEach(file => {
        console.log(`File uploaded: ${file.originalname}`);
      });
    }

    // Read existing data from response.json
    let responses = {};
    try {
      responses = JSON.parse(fs.readFileSync('response.json'));
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error('Error reading response.json:', err);
      }
    }

    // Add new data to the correct IP group
    if (!responses[ipAddress]) {
      responses[ipAddress] = [];
    }
    responses[ipAddress].push(data);

    // Save the updated data to response.json
    fs.writeFileSync('response.json', JSON.stringify(responses, null, 2));

    res.send('Data and files received and saved!');
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = { startServer };