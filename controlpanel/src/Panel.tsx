import { useEffect, useState } from "react";
import styles from "./Panel.module.scss";
import { Add, FastForward, FastRewind, Pause, PlayArrow, Remove } from "@mui/icons-material";
import config from "../../config.json";

function Panel() {
  const [paused, setPaused] = useState(false);
  const [delay, setDelay] = useState(12);
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch(`http://${process.env.DEV ? "localhost" : config.host}:${config.port}/api/data`)
      .then((res) => res.json())
      .then((data) => {
        const { paused, delay } = data;

        setPaused(paused);

        setDelay(delay / 1000);
      });
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`ws://${process.env.DEV ? "localhost" : config.host}:${config.port}`);

    socket.addEventListener("open", () => {
      console.log("Connected to the server.");
    });

    socket.addEventListener("message", (event) => {
      const { image } = JSON.parse(event.data);

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
    fetch(`http://${process.env.DEV ? "localhost" : config.host}:${config.port}/refresh`);
  };

  const handlePause = () => {
    console.log("pause");

    fetch(`http://${process.env.DEV ? "localhost" : config.host}:${config.port}/pauseplay`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
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
            <p>{delay}s</p>
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
