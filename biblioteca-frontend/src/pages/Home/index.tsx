import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/styles.module.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to the Library App</h1>
        <p className={styles.description}>
          Manage your library efficiently with our platform. Please log in or register to get started!
        </p>
        <div className={styles.buttonContainer}>
          <button
            onClick={() => navigate("/login")}
            className={styles.button}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className={styles.buttonOutline}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
