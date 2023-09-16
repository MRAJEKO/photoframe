const { app, paused } = require("../server");

app.get("/api/paused", (_request, response) => {
  response.send({ paused });
});
