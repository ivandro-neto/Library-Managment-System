import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/styles.module.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src="/logo.svg" alt="" loading="lazy" />
        <h1 className={styles.title}>Bem-vindo a Library App</h1>
        <p className={styles.description}>
        Gerencie sua biblioteca de forma eficiente com nossa plataforma.
        </p>
        <p className={styles.description}>
        Por favor, faça login ou registre-se para começar!
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
