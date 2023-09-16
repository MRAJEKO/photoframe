const { app, wss, prevShownImages, nextImage, stopInterval, startInterval } = require("../server.js");
let { paused } = require("../server.js");
const { sendInfo } = require("../utils/info.js");

app.post("/api/pauseplay", (_request, response) => {
  paused = !paused;

  console.log(paused);

  if (paused) stopInterval();
  else {
    sendInfo(wss, prevShownImages, nextImage);
    startInterval();
  }

  response.send({ paused });
});
