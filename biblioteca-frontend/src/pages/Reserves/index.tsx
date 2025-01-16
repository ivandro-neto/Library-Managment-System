import { useState, useEffect, useContext } from "react";
import ReservationTable from "../../components/ReserveTable"; // Verifique se o nome está correto
import Layout from "../Layout";
import styles from "./css/styles.module.css";
import { AuthContext } from "../../context/AuthContext"; // Supondo que você tenha um contexto de autenticação
import axios from "axios";
import SearchBar from "../../components/SearchInput";
import { Roles } from "../../utils/Roles";

const ReservesPage: React.FC = () => {
  const { accessToken, user } = useContext(AuthContext);
  const [latestReserves, setLatestReserves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (!query) {
      setFilteredBooks(latestReserves); // Exibe todos os livros se não houver consulta
    } else {
      const results = latestReserves.filter((book) =>
        book.bookTitle.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(results); // Atualiza a lista filtrada
    }
  }, [query, latestReserves]);

  const calculateRemainingDays = (dueDate: string): number => {
    const dueDateObj = new Date(dueDate); // Converte a data de entrega para um objeto Date
    const today = new Date(); // Obtém a data atual
  
    // Calcula a diferença em milissegundos
    const differenceInMs = dueDateObj.getTime() - today.getTime();
  
    // Converte a diferença para dias
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
  
   return differenceInDays;
  };

  useEffect(() => {
    const fetchReserves = async () => {
     
      try {
        const loansResponse = await axios.get(`http://localhost:3000/api/loans/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(loansResponse)
        const loans = Array.isArray(loansResponse.data.data.loan)
          ? await Promise.all(
              loansResponse.data.data.loan.map(async (loan) => {
                const bookResponse = await axios.get(
                  `http://localhost:3000/api/books/${loan.bookId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );
  
                return {
                  ...loan,
                  bookTitle: bookResponse.data.data.book.title,
                };
              })
            )
          : [];
        setLatestReserves(loans);
      } catch (err: any) {
        console.error("Error fetching reserves:", err);
        setError(err.response?.data?.message || "Failed to load reserves.");
      } finally {
        setLoading(false);
      }
    };
  
    if (accessToken && user?.id) {
      fetchReserves();
    }
  }, [accessToken, user?.id]);
  
  useEffect(() => {
    const sendNotifications = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/users', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const admin = result.data.data.users.find((u) => u.roles[0] === Roles.admin);
  
        latestReserves.forEach(async (loan) => {
          const remainingDays = calculateRemainingDays(loan.dueDate);
  
          if (remainingDays <= 0) {
            await axios.post(
              'http://localhost:3000/api/notifications',
              {
                userId: admin.id,
                title: 'Due late alert!',
                message: `This book ${loan.bookTitle}, was supposed to be returned on ${loan.dueDate}!`,
                type: 'warn',
              },
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
  
            await axios.post(
              'http://localhost:3000/api/notifications',
              {
                userId: user?.id,
                title: 'Due late alert!',
                message: `This book ${loan.bookTitle}, was supposed to be returned on ${loan.dueDate}!`,
                type: 'warn',
              },
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
          }
        });
      } catch (error) {
        console.error('Error sending notifications:', error);
      }
    };
  
    const notificationInterval = setInterval(()=>sendNotifications(), 60000 * 10); // Executa a cada 10 minutos
  
    return () => clearInterval(notificationInterval); // Limpa o intervalo ao desmontar o componente
  }, [latestReserves, accessToken, user]);
  
      if (loading) {
        return <div>Loading...</div>;
      }
      
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout>
      <div className={styles.header}>
        <SearchBar onSearch={setQuery} /> {/* Passa a função para atualizar a query */}
      </div>
      <div className={styles.page}>
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Latest Reserves</h2>
          <ReservationTable data={filteredBooks} />
        </div>
      </div>
    </Layout>
  );
};

export default ReservesPage;
