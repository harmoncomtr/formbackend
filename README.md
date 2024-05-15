## Simple Data Server

This Node.js script creates a basic web server that receives data from an HTML form, prints it to the console, and saves it to a JSON file.

**Features:**

- **Starts a server:** Listens on a specified port (default 3000).
- **Handles POST requests:** Receives data from a form at a specific endpoint (default `/data`).
- **Prints data to console:** Outputs the received data in a formatted way.
- **Saves data to JSON:** Creates or updates `response.json` with the received data.

**How to Use:**

1. **Install dependencies:**
   ```bash
   npm install express fs
   ```

2. **Create an HTML form:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Data Submission</title>
   </head>
   <body>
     <form action="http://localhost:3000/data" method="POST">
       <label for="name">Name:</label>
       <input type="text" id="name" name="name" />
       <br>
       <label for="surname">Surname:</label>
       <input type="text" id="surname" name="surname" />
       <br>
       <input type="submit" value="Submit" />
     </form>
   </body>
   </html>
   ```

3. **Run the server:**
   ```bash
   node index.js 
   ```

4. **Submit the form.** The server will log the data and save it to `response.json`.

**Customization:**

- **Port:** Modify the `port` argument when calling `startServer()`.
- **Endpoint:** Change the `endpoint` argument in `startServer()` to customize the URL where the form submits data.

**Example:**

If the form sends data:

```json
{
  "name": "John",
  "surname": "Doe"
}
```

The console output will be:

```
name: John, Surname: Doe
```

And `response.json` will contain:

```json
{
  "name": "John",
  "surname": "Doe"
}
```
