import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../utils/Roles";
import styles from "./css/styles.module.css";

const LoginPage: React.FC = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);

      if (user?.roles.includes(Roles.user)) {
        navigate("/library");
      } else if (user?.roles.includes(Roles.admin)) {
        navigate("/admin/library");
      } else {
        setError("Invalid role assigned to the user.");
      }
    } catch (error) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>

      <p>
        Create a new account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className={styles.link}
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
