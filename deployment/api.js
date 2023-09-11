app.get("/api/image", async (_request, response) => {
  fs.readdir("../public/images", async (_err, files) => {
    const images = files.filter((file) => extentions.includes(path.extname(file).toLowerCase()));

    const config = require(path.join(__dirname, "config.json"));

    console.log(prevShownImages);

    if (prevShownImages.length === config.refresh_threshold || prevShownImages.length === images.length)
      prevShownImages.shift();

    const possibleImages = images.filter((image) => !prevShownImages.includes(image));

    const randomImage = possibleImages[Math.floor(Math.random() * possibleImages.length)];

    console.log(randomImage);

    prevShownImages.push(randomImage);

    response.json({ image: randomImage });
  });
});
