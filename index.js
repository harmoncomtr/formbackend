const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); 

function startServer(port = 3000, endpoint = '/data') {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false })); 

  // Read IP UUID mapping from ips.json
  let ipUUIDMap = {};
  try {
    const ipUUIDData = fs.readFileSync('ips.json', 'utf-8');
    ipUUIDMap = JSON.parse(ipUUIDData);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error reading ips.json:', err);
    }
  }

  // Create multer storage with custom file naming logic
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const ipAddress = req.ip;
      const uuid = ipUUIDMap[ipAddress] || generateUUIDForIP(ipAddress); // Get or generate UUID

      // Increment the request count for this UUID
      let requestCount = ipUUIDMap[uuid] || 0; // Check if count exists, otherwise start from 0
      requestCount++;
      ipUUIDMap[uuid] = requestCount;

      // Save updated request count to ips.json
      fs.writeFileSync('ips.json', JSON.stringify(ipUUIDMap, null, 2));

      const dataDir = `data/${uuid}/${requestCount}`;

      console.log('Data Dir:', dataDir); // Log the data directory path
      // Create the directory if it doesn't exist
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true }); 
      }

      cb(null, dataDir); // Changed to the dataDir itself
    },
    filename: (req, file, cb) => {
      const filename = `${uuidv4()}.${file.originalname.split('.').pop()}`; 
      console.log('Filename:', filename); // Log the generated filename
      cb(null, filename); 
    }
  });

  const upload = multer({ storage: storage });

  app.post(endpoint, upload.array('files'), (req, res) => {
    const data = req.body;
    const ipAddress = req.ip;
    const uuid = ipUUIDMap[ipAddress];
    const requestCount = ipUUIDMap[uuid]; // Use the requestCount from ips.json
    const responseDir = `data/${uuid}/${requestCount}`;
    const ipFolder = `data/${uuid}`; // Path to the IP's folder

    // Handle data from form fields
    let output = '';
    for (const key in data) {
      output += `${key}: ${data[key]}, `;
    }
    output = output.slice(0, -2); // Remove trailing comma and space

    console.log(`UUID: ${uuid}, Data: ${output}`);

    // Handle uploaded files
    if (req.files) {
      req.files.forEach(file => {
        console.log(`File uploaded: ${file.originalname}`);
      });
    }

    // Save form data to data.json
    fs.writeFileSync(`${responseDir}/data.json`, JSON.stringify(data, null, 2));

    // Save IP to ip.txt inside the IP's folder
    fs.writeFileSync(`${ipFolder}/ip.txt`, ipAddress);

    // Add new data to the correct UUID group in responses
    if (!responses[uuid]) {
      responses[uuid] = [];
    }
    responses[uuid].push(data);

    res.send('Data and files received and saved!');
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  function generateUUIDForIP(ipAddress) {
    const uuid = uuidv4();
    ipUUIDMap[ipAddress] = uuid;
    fs.writeFileSync('ips.json', JSON.stringify(ipUUIDMap));
    return uuid;
  }
}

module.exports = { startServer };