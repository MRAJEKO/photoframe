var imageContainer = document.getElementById("image");
var nextImageContainer = document.getElementById("loading");
var textContainer = document.getElementById("text");

function connectToSocket() {
  var socket = new WebSocket("ws://192.168.0.111:3000");

  socket.onopen = function (event) {
    console.log("Connected to the server.");
  };

  socket.onmessage = function (event) {
    console.log(event);
    var data = JSON.parse(event.data);

    textContainer.innerHTML = data.text;
    imageContainer.src = data.image;
    nextImageContainer.src = data.nextImage;
  };

  socket.onclose = function (event) {
    console.log("Connection closed.");
    textContainer.innerHTML = "Reconnecting...";
    setTimeout(function () {
      connectToSocket();
    }, 2500);
  };
}

connectToSocket();
