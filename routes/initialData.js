const { app, paused, delay } = require("../server");

app.get("/api/data", (_request, response) => {
  response.send({ paused, delay });
});
