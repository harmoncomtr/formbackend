const express = require('express');
const fs = require('fs');

function startServer(port = 3000, endpoint = '/data') {
  const app = express();

  app.post(endpoint, (req, res) => {
    const data = req.body;
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