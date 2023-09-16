const { app, wss, prevShownImages, nextImage } = require("../server");

const { sendInfo } = require("../utils/info");

app.post("/api/refresh", (_request, response) => {
  sendInfo(wss, prevShownImages, nextImage);

  response.sendStatus(201);
});
