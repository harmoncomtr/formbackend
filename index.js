const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); 

function startServer(port = 3000, endpoint = '/data') {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false })); 

  // Create multer storage with custom file naming logic
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const ipAddress = req.ip;
      const responseCount = (req.body.responses || {})[ipAddress] ? (req.body.responses[ipAddress].length + 1) : 1;
      const dataDir = `data/${ipAddress}/${responseCount}`;

      cb(null, `${dataDir}/uploads`); // Specify uploads subfolder
    },
    filename: (req, file, cb) => {
      const filename = `${uuidv4()}.${file.originalname.split('.').pop()}`; 
      cb(null, filename); 
    }
  });

  const upload = multer({ storage: storage });

  app.post(endpoint, upload.array('files'), (req, res) => {
    const data = req.body;
    const ipAddress = req.ip;
    const responseCount = (req.body.responses || {})[ipAddress] ? (req.body.responses[ipAddress].length + 1) : 1;
    const responseDir = `data/${ipAddress}/${responseCount}`;

    // Create the directory if it doesn't exist (before multer tries to use it)
    if (!fs.existsSync(responseDir)) {
      fs.mkdirSync(responseDir, { recursive: true }); // Create recursively
    }

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

    // Save form data to data.json
    fs.writeFileSync(`${responseDir}/data.json`, JSON.stringify(data, null, 2));

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