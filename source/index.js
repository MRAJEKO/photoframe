const imageContainer = document.getElementById("image");
const nextImageContainer = document.getElementById("loading");
const textContainer = document.getElementById("text");

function connectToSocket() {
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", (event) => {
    console.log("Connected to the server.");
  });

  socket.addEventListener("message", (event) => {
    console.log(event);
    const { text, image, nextImage } = JSON.parse(event.data);

    console.log(text);

    textContainer.textContent = text;
    imageContainer.src = image;
    nextImageContainer.src = nextImage;
  });

  socket.addEventListener("close", (event) => {
    console.log("Connection closed.");
    textContainer.textContent = "Reconnecting...";
    setTimeout(() => {
      connectToSocket();
    }, 2500);
  });
}

connectToSocket();
