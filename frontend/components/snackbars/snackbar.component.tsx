"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { removeSnackbar, SnackbarData } from "@/lib/store/ui/ui.slice";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import styles from "./snackbar.module.scss";

const Snackbar = ({ id, message, timeout, type }: SnackbarData) => {
  const dispatch = useAppDispatch();
  const [life, setLife] = useState(100);
  const [exit, setExit] = useState(false);
  const [parsedMessage, setParsedMessage] = useState(message);

  useEffect(() => {
    let timeLeft = timeout;
    if (type === "error") {
      if (message.startsWith("PWB_ERROR")) {
        const code = message.split(";")[1];
        switch (code) {
          case "400":
            setParsedMessage(`Złe dane - ${message.split(" - ")[1]}`);
            break;
          case "401":
            setParsedMessage(`Zaloguj się`);
            break;
          case "403":
            setParsedMessage(`Brak uprawnień`);
            break;
          default:
            setParsedMessage(`Błąd ${code}`);
            break;
        }
      } else if (
        message.startsWith("An error occurred in the Server Components render.")
      ) {
        setParsedMessage("Błąd na serwerze");
      }
    }
    const anim = setInterval(() => {
      timeLeft -= 10;
      setLife((timeLeft / timeout) * 100);
      if (timeLeft <= 300) setExit(true);
    }, 10);
    setTimeout(kill, timeout);

    return () => {
      clearInterval(anim);
    };
  }, []);

  const kill = () => {
    dispatch(removeSnackbar(id));
  };

  return (
    <div
      className={`${styles.container} ${exit ? styles.exit : ""} ${
        styles[type]
      }`}
    >
      <p>{parsedMessage}</p>
      <IconX onClick={kill} />
      <div className={`${styles.lifeBar} ${styles.full}`}></div>
      <div style={{ width: `${life}%` }} className={styles.lifeBar}></div>
    </div>
  );
};

export default Snackbar;
