import express from "express";
import fetch from "node-fetch";
import { promises as fsPromises } from "fs";
import path from "path";
import * as url from "url";

const app = express();
const port = 3000;

// Derive __dirname and __filename using import.meta.url
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

app.get("/download-image", async (req, res) => {
  const imageUrl =
    "https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=342524392225274&ext=1720095609&hash=ATtlCJyK6eTyqKyK_bwEi8Iy_1gftD4tOioJx6l6KaJfNw";
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer(); // Fetch as ArrayBuffer

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Define the full path for the image file
    const filePath = path.join(__dirname, "downloads", "image.jpeg");

    // Ensure the directory exists
    await fsPromises.mkdir(path.dirname(filePath), { recursive: true });

    // Write the image file
    await fsPromises.writeFile(filePath, buffer);

    // Serve the image file directly
    res.sendFile(filePath);
  } catch (error) {
    console.error("Failed to download image:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/view-image/:filename", async (req, res) => {
  const filePath = path.join(__dirname, "downloads", req.params.filename);
  try {
    const stats = await fsPromises.stat(filePath);
    if (!stats.isFile()) {
      console.error(`File does not exist: ${filePath}`);
      res.sendStatus(404);
    } else {
      res.sendFile(filePath);
    }
  } catch (err) {
    console.error("File not found:", err);
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
