require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const WebSocket = require("ws");
const http = require("http");
let config = require("./config.json");
const { sendInfo } = require("./utils/info");

const app = express();

app.use(cors());

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

let paused = false;
let delay = config.interval_rate;

let intervalID;

function startInterval() {
  intervalID = setInterval(() => {
    config = require("./config.json");
    delay = config.interval_rate;

    sendInfo(wss);
  }, config.interval_rate);
}

function stopInterval() {
  clearInterval(intervalID);
}

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected: " + ws._socket.remoteAddress);

  stopInterval();

  sendInfo(wss);

  startInterval();
});

server.listen(config.port, () => {
  console.log(`Server is running on ${config.port}`);
});

module.exports = {
  wss,
  app,
  paused,
  delay,
  startInterval,
  stopInterval,
};

require("./routes/pauseplay");
require("./routes/refresh");
require("./routes/initialData");

// test
