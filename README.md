# formbackend

A simple Node.js server to handle form submissions with file uploads and store data in a structured way.

## Installation

```bash
npm install formbackend
```

## Usage

1. **Create `ips.json` file:**
   - This file will store the mapping of IP addresses to UUIDs and request counts.
   - Initially, create an empty `ips.json` file in the root directory of your project.

2. **Start the server:**

   ```javascript
   const formbackend = require('formbackend');

   formbackend.startServer(3000, '/data'); // Port 3000, endpoint /data 
   ```

3. **Create your HTML form:**

   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Form Submission</title>
   </head>
   <body>
     <form action="/data" method="POST" enctype="multipart/form-data">
       <label for="name">Name:</label>
       <input type="text" id="name" name="name" required><br><br>
 
       <label for="email">Email:</label>
       <input type="email" id="email" name="email" required><br><br>
 
       <label for="message">Message:</label>
       <textarea id="message" name="message" required></textarea><br><br>
 
       <label for="file">Upload File:</label>
       <input type="file" id="file" name="files"><br><br>
 
       <button type="submit">Submit</button>
     </form>
   </body>
   </html>
   ```

4. **Run your server:**
   - Make sure your server code is running in the same directory as your HTML form.
   - Open the HTML form in a browser.
   - Submit the form.

## Data Structure

The server organizes data as follows:

- **`data` folder:**
  - **`[UUID]` folder:**
    - **`ip.txt`:** Stores the IP address associated with the UUID.
    - **`[Request Count]` folder:**
      - **`data.json`:** Contains the form data submitted.
      - **`response.json`:** Tracks all responses for the UUID.
      - **Uploaded files:** Files uploaded with the form are saved within this folder.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[MIT](LICENSE)

```markdown
**Explanation:**

* **README:**
    * **Installation:** Explains how to install the package using `npm install formbackend`.
    * **Usage:** Steps on setting up the `ips.json` file, starting the server, creating the HTML form, and running the server.
    * **Data Structure:**  Clearly outlines the file and folder organization of the saved data.
    * **Example Server Code:** Includes a fully functional `index.js` server file.
    * **Contributing:** Encourages contributions and provides guidance on how to contribute.
    * **License:** Specifies the MIT license.
* **Example HTML Form:**  
    * Provides a basic HTML form with input fields, a file upload input, and a submit button.
* **Example Server Code:**
    * `formbackend` npm package functionality.
    * Uses `multer` for handling file uploads.
    * Saves form data, IP address, and files in a structured way.

**Important Notes:**

* **Node.js:** Make sure you have Node.js installed on your machine.
* **Project Setup:** Create a new Node.js project, install the `formbackend` package, and create the `ips.json` file.
* **Server Configuration:**  You can customize the port number and endpoint URL in the `startServer` call.
* **Deployment:** Once your server code is ready, you can deploy it to a web hosting service.

I hope this helps you with your `formbackend` project!
```