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
        alert(`File uploaded successfully: ${result.file.name}`);
      } else {
        alert(`Error uploading file: ${result.message}`);
      }
    });
  </script>
</body>
</html>
