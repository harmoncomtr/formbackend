const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser'); // Import body-parser

function startServer(port = 3000, endpoint = '/data') {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false })); // Use body-parser middleware

  app.post(endpoint, (req, res) => {
    const data = req.body; // Data will now be parsed correctly

    let output = '';

    for (const key in data) {
      output += `${key}: ${data[key]}, `;
    }

    // Remove trailing comma and space
    output = output.slice(0, -2);

    console.log(output);

    // Save to response.json
    try {
      fs.writeFileSync('response.json', JSON.stringify(data, null, 2));
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File doesn't exist, create it
        fs.writeFileSync('response.json', JSON.stringify(data, null, 2));
      } else {
        console.error('Error saving data to response.json:', err);
      }
    }

    res.send('Data received and saved!');
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = { startServer };