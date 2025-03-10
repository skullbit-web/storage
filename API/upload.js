import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { promises as fsPromises } from 'fs';

// Set up the uploads directory (if not already created)
const uploadDir = path.join(process.cwd(), '/uploads');
fsPromises.mkdir(uploadDir, { recursive: true }).catch(() => {});

// Disable the default Vercel body parser for file uploads
export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for form handling
  },
};

const handler = async (req, res) => {
  if (req.method === 'GET') {
    // Serve the HTML file upload form for GET requests
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Upload Files</title>
      </head>
      <body>
        <h1>Upload a File</h1>
        <form id="uploadForm" enctype="multipart/form-data" method="POST">
          <input type="file" name="file" id="file" required />
          <button type="submit">Upload</button>
        </form>

        <script>
          document.getElementById("uploadForm").addEventListener("submit", async function(event) {
            event.preventDefault();

            const formData = new FormData();
            formData.append("file", document.getElementById("file").files[0]);

            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            const result = await response.json();
            if (response.ok) {
              alert(\`File uploaded successfully: \${result.file.name}\`);
            } else {
              alert(\`Error uploading file: \${result.message}\`);
            }
          });
        </script>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlContent);
  } else if (req.method === 'POST') {
    // Handle file upload via POST requests
    const form = new IncomingForm();
    form.uploadDir = uploadDir; // Set the directory for uploads
    form.keepExtensions = true; // Retain the file extensions
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to parse the form' });
      }
      
      // Assuming the file field is named 'file'
      const file = files.file[0]; 
      
      // Respond with file info
      res.status(200).json({
        message: 'File uploaded successfully',
        file: {
          name: file.originalFilename,
          path: file.filepath,
        },
      });
    });
  } else {
    // Return an error for unsupported HTTP methods
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
