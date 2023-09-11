const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

// app.use(express.static(path.join(__dirname, "build")));

app.get("/", (_request, response) => {
  response.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/index.js", (_request, response) => {
  response.sendFile(path.join(__dirname, "build", "index.js"));
});

app.get("/style.css", (_request, response) => {
  response.sendFile(path.join(__dirname, "build", "style.css"));
});

app.get("/config.json", (_request, response) => {
  response.sendFile(path.join(__dirname, "config.json"));
});

const extentions = [".jpg", ".png", ".webp", ".gif"];

const prevShownImages = [];

app.get("/api/image", async (_request, response) => {
  fs.readdir("../public/images", async (_err, files) => {
    const images = files.filter((file) => extentions.includes(path.extname(file).toLowerCase()));

    const config = require(path.join(__dirname, "config.json"));

    console.log(prevShownImages);

    if (prevShownImages.length === config.refresh_threshold || prevShownImages.length === images.length)
      prevShownImages.shift();

    const possibleImages = images.filter((image) => !prevShownImages.includes(image));

    const randomImage = possibleImages[Math.floor(Math.random() * possibleImages.length)];

    console.log(randomImage);

    prevShownImages.push(randomImage);

    response.json({ image: randomImage });
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
