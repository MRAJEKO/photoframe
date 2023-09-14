require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");
const http = require("http");
let config = require("./config.json");

const app = express();

app.use(express.static(path.join(__dirname, "./public")));

if (!process.env.DEV) app.use("/control", express.static(path.join(__dirname, "./controlpanel/dist")));

app.get("/", (_request, response) => {
  response.sendFile(path.join(__dirname, process.env.DEV ? "source" : "frame", "index.html"));
});

app.get("/index.js", (_request, response) => {
  response.sendFile(path.join(__dirname, process.env.DEV ? "source" : "frame", "index.js"));
});

app.get("/style.css", (_request, response) => {
  response.sendFile(path.join(__dirname, process.env.DEV ? "source" : "frame", "style.css"));
});

app.get("/config.json", (_request, response) => {
  response.sendFile(path.join(__dirname, "config.json"));
});

const extentions = [".jpg", ".png", ".webp", ".gif"];

const prevShownImages = [];

const monthName = (month) => {
  switch (month) {
    case "01":
      return "Jan";
    case "02":
      return "Feb";
    case "03":
      return "Mar";
    case "04":
      return "Apr";
    case "05":
      return "May";
    case "06":
      return "Jun";
    case "07":
      return "Jul";
    case "08":
      return "Aug";
    case "09":
      return "Sep";
    case "10":
      return "Oct";
    case "11":
      return "Nov";
    case "12":
      return "Dec";
  }
};

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let nextImage = "";

const getInfo = () => {
  const files = fs.readdirSync("./public/images");
  const images = files.filter((file) => extentions.includes(path.extname(file).toLowerCase()));

  config = require(path.join(__dirname, "config.json"));

  if (prevShownImages.length === config.refresh_threshold || prevShownImages.length === images.length)
    prevShownImages.shift();

  const possibleImages = images.filter((image) => !prevShownImages.includes(image));

  const image = nextImage || possibleImages[Math.floor(Math.random() * possibleImages.length)];

  nextImage = possibleImages[Math.floor(Math.random() * possibleImages.length)];

  prevShownImages.push(image);

  const date = image.split("_")[0];

  const [year, month, day] = date.split("-");

  const text = `${monthName(month)} '${year.slice(2)}`;

  const prevImagePath = `${
    process.env.DEV ? "http://localhost:3000" : `${config.host}:${config.port}`
  }/images/${nextImage}`;

  const imagePath = `${process.env.DEV ? "http://localhost:3000" : `${config.host}:${config.port}`}/images/${image}`;

  return JSON.stringify({ image: imagePath, nextImage: prevImagePath, text });
};

wss.on("connection", (ws) => {
  console.log("New client connected: " + ws._socket.remoteAddress);

  const info = getInfo();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(info);
    }
  });
});

setInterval(() => {
  const info = getInfo();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(info);
    }
  });
}, config.interval_rate);

server.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});
