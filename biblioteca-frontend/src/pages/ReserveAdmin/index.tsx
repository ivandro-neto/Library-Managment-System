import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ReserveAdminTable from "../../components/ReserveAdminTable";
import Layout from "../Layout";
import { AuthContext } from "../../context/AuthContext";
import styles from "./css/styles.module.css";
import SearchBar from "../../components/SearchInput";

const ReserveAdminPage: React.FC = () => {
  const [latestReserves, setLatestReserves] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, user } = useContext(AuthContext);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");

  const calculateRemainingDays = (dueDate: string): number => {
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    return Math.ceil((dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Busca reservas da API
  const fetchReserves = async () => {
    try {
      const loansResponse = await axios.get(`http://localhost:3000/api/loans`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const loans = await Promise.all(
        loansResponse.data.data.loans.map(async (loan) => {
          const bookResponse = await axios.get(
            `http://localhost:3000/api/books/${loan.bookId}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          return { ...loan, bookTitle: bookResponse.data.data.book.title };
        })
      );

      setLatestReserves(loans);
    } catch (err: any) {
      console.error("Error fetching reserves:", err);
      setError(err.response?.data?.message || "Failed to load reserves.");
    } finally {
      setLoading(false);
    }
  };

  // Envia notificações para livros atrasados
  const sendNotifications = async () => {
    try {
      for (const loan of latestReserves) {
        const remainingDays = calculateRemainingDays(loan.dueDate);

        if (remainingDays <= 0) {
          await axios.post(
            "http://localhost:3000/api/notifications",
            {
              userId: user?.id,
              title: "Due late alert!",
              message: `This book "${loan.bookTitle}" was supposed to be returned on ${loan.dueDate}!`,
              type: "warn",
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          await axios.post(
            "http://localhost:3000/api/notifications",
            {
              userId: loan.userId,
              title: "Due late alert!",
              message: `This book "${loan.bookTitle}" was supposed to be returned on ${loan.dueDate}!`,
              type: "warn",
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        }
      }
    } catch (err) {
      console.error("Error sending notifications:", err);
    }
  };

  useEffect(() => {
    if (accessToken) fetchReserves();
  }, [accessToken]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      sendNotifications();
    }, 60000 * 10); // Verifica atrasos a cada 10 minutos

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar
  }, [latestReserves]);

  useEffect(() => {
    if (!query) {
      setFilteredBooks(latestReserves);
    } else {
      const results = latestReserves.filter((book) =>
        book.bookTitle.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(results);
    }
  }, [query, latestReserves]);

  if (loading) {
    return (
      <Layout>
        <div className={styles.page}>
          <p>Loading reserves...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        
      <div className={styles.page}>
      <h1 className={styles.title}>Reserves</h1>
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Latest Reserves</h2>
          {filteredBooks.length > 0 ? (
            <ReserveAdminTable data={filteredBooks} />
          ) : (
            <p>No reserves found.</p>
          )}
        </div>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.header}>
        <SearchBar onSearch={setQuery} />
      </div>
      <div className={styles.page}>
      <h1 className={styles.title}>Reserves</h1>
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Latest Reserves</h2>
          {filteredBooks.length > 0 ? (
            <ReserveAdminTable data={filteredBooks} />
          ) : (
            <p>No reserves found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReserveAdminPage;
