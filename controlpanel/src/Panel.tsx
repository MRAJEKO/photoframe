import { useEffect, useState } from "react";
import styles from "./Panel.module.scss";
import { Add, FastForward, FastRewind, Pause, PlayArrow, PlusOne, Remove } from "@mui/icons-material";

function Panel() {
  const [paused, setPaused] = useState(false);
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3000/api/paused`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPaused(data.paused);
      });
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", () => {
      console.log("Connected to the server.");
    });

    socket.addEventListener("message", (event) => {
      const { text, image, nextImage } = JSON.parse(event.data);

      setImage(image);
    });

    socket.addEventListener("close", () => {
      console.log("Connection closed.");
    });

    return () => {
      socket.close();
    };
  }, []);

  const handleNew = () => {
    console.log("click");

    fetch("http://localhost:3000/api/refresh", {
      method: "POST",
    });
  };

  const handlePause = () => {
    console.log("pause");

    fetch(`http://localhost:3000/api/pauseplay`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPaused(data.paused);
      });
  };

  return (
    <div className={styles.container}>
      <div className="settings"></div>
      <div className={styles.control} style={{ backgroundImage: `url("${image}")` }}>
        <div className={styles["gradient-overlay"]}>
          <div className={styles.buttons}>
            <div className={styles.icon}>
              <FastRewind fontSize="inherit" />
            </div>
            <div className={styles.icon} onClick={handlePause}>
              {paused ? <PlayArrow fontSize="inherit" /> : <Pause fontSize="inherit" />}
            </div>
            <div className={styles.icon} onClick={handleNew}>
              <FastForward fontSize="inherit" />
            </div>
          </div>
          <div className={styles.delay}>
            <div className={styles.icon}>
              <Add fontSize="inherit" />
            </div>
            <p>15s</p>
            <div className={styles.icon}>
              <Remove fontSize="inherit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Panel;
