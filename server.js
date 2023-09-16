require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");
const http = require("http");
let config = require("./config.json");
const { sendInfo } = require("./utils/info");

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

let intervalID;

let nextImage = "";

function startInterval() {
  intervalID = setInterval(() => {
    config = require("./config.json");
    sendInfo(wss, prevShownImages, nextImage);
  }, config.interval_rate);
}

function stopInterval() {
  clearInterval(intervalID);
}

let paused = false;

const prevShownImages = [];

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected: " + ws._socket.remoteAddress);

  startInterval();
});

server.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});

console.log("Server started");

module.exports = {
  wss,
  app,
  prevShownImages,
  nextImage,
  paused,
  startInterval,
  stopInterval,
};

require("./routes/pauseplay");
require("./routes/refresh");
require("./routes/paused");
