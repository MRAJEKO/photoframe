const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => res.sendFile("/volume1/node_server/photoframe/index.html"));
app.listen(3000, () => console.log("Example app listening on port 3000!"));
