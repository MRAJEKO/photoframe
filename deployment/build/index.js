var imageContainer = document.getElementById("image");
var loadingContainer = document.getElementById("loading");
var config = {};

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

function loop() {
  try {
    fetch("/config.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        config = data;

        fetch("/api/image")
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            var image = data.image;
            loadingContainer.src = "images/" + image;

            var startTime = new Date().getTime();

            loadingContainer.onload = function () {
              var delta = new Date().getTime() - startTime;

              var waitingTime = 15000 - delta;

              if (waitingTime < 0) {
                waitingTime = 0;
              }

              sleep(waitingTime).then(function () {
                imageContainer.src = loadingContainer.src;
              });
            };

            loadingContainer.onerror = function (error) {
              console.error("Error loading image:", error);
            };
          })
          .catch(function (error) {
            console.error("Error fetching image:", error);
          });
      })
      .catch(function (error) {
        console.error("Error fetching config:", error);
      });
  } catch (error) {
    console.error("Error in loop:", error);
  }
}

loop();

setInterval(function () {
  loop();
}, 15000);
