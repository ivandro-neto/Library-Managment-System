import { memo, useEffect, useState } from "react";
import axios from "axios";
import Layout from "../Layout";
import styles from "./css/styles.module.css";
import NotificationsTable from "../../components/NotificationTable";

const iconType = (type: string): string => {
  return type === "⚠️" ? "/icons/warn.svg" : "/icons/info.svg";
};

// Obter notificações da API
const fetchNotifications = async () => {
  try {
    const apiBaseURL = "http://localhost:3000/api";  // Ajuste a URL base conforme necessário
    const response = await axios.get(`${apiBaseURL}/notifications`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

const InboxPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Array<{
    type: "Atraso na entrega" | "Livro disponível";
    bookTitle: string;
    description: string;
    icon: string;
  }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      const notificationsData = await fetchNotifications();
      if (notificationsData.length === 0) {
        setError("No notifications available.");
      }
      setNotifications(notificationsData);
      setLoading(false);
    };

    loadNotifications();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className={styles.page}>
          <h1 className={styles.title}>Inbox</h1>
          <p>Loading notifications...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.page}>
          <h1 className={styles.title}>Inbox</h1>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.page}>
        <h1 className={styles.title}>Inbox</h1>
        <NotificationsTable data={notifications} />
      </div>
    </Layout>
  );
};

export default memo(InboxPage);
