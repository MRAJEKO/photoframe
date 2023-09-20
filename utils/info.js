const fs = require("fs");
const path = require("path");
const { monthName } = require("./months");
const WebSocket = require("ws");

const extentions = [".jpg", ".png", ".webp", ".gif"];

const getInfo = (prevShownImages, nextImage) => {
  console.log(prevShownImages);

  const files = fs.readdirSync("./public/images");
  const images = files.filter((file) => extentions.includes(path.extname(file).toLowerCase()));

  const config = require(path.join(__dirname, "../config.json"));

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

const sendInfo = (wss, prevShownImages, nextImage) => {
  const info = getInfo(prevShownImages, nextImage);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(info);
    }
  });
};

module.exports = {
  sendInfo,
};