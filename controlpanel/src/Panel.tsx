import { useEffect, useState } from "react";
import styles from "./Panel.module.scss";
import { FastForward, FastRewind, Pause } from "@mui/icons-material";

function Panel() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/paused`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPaused(data.paused);
      });
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
      <div className={styles.controls}>
        <div className={styles.buttons}>
          <FastRewind fontSize="inherit" />
          <Pause fontSize="inherit" />
          <div className={styles["icon-small"]}>
            <FastForward />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Panel;
