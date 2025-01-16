import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ReserveAdminTable from "../../components/ReserveAdminTable";
import Layout from "../Layout";
import { AuthContext } from "../../context/AuthContext";
import styles from "./css/styles.module.css";
import SearchBar from "../../components/SearchInput";
import ValidateReturnModal from "../../components/ValidateReturnModal";
import { Roles } from "../../utils/Roles";

interface PopUp{
  success: boolean;
  content: string;
}

const ReserveAdminPage: React.FC = () => {
  const [latestReserves, setLatestReserves] = useState<any[]>([]);
  const [reserveId, setReserveId] = useState<string>("");
  const [isValidateReturnModalOpen, setIsValidateReturnModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, user } = useContext(AuthContext);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [popupList, setPopUpList] = useState<PopUp[]>([]);

useEffect(() => {
    const timeout = setTimeout(() => {
      setPopUpList((prevList) => {
        const updatedList = [...prevList]; // Cria uma cópia do estado atual
        updatedList.pop(); // Remove o último elemento
        return updatedList; // Atualiza o estado com a nova lista
      });
    }, 2000);
  
    return () => clearTimeout(timeout); // Limpa o timeout quando o componente desmontar
  }, [popupList]);

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

  const handleValidation = async (code: number) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/loans/${reserveId}/validate`,
        { code },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );

      if(response.status < 400){
        setPopUpList((prevList) => [
          ...prevList,
          { success: true, content: "Loan validated successfully" },
        ]);
      }else{
        setPopUpList((prevList) => [
          ...prevList,
          { success: false, content: "Error validating the loan" },
        ]);
      }
      const result = await axios.get(
        'http://localhost:3000/api/users',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      const commonUsers = result.data.data.users.filter(user => user.roles.includes(Roles.user))
      const book = latestReserves.filter(reserve => reserve.id === reserveId)[0];
      for (let u = 0; u < commonUsers.length; u++) {
        const notification = await axios.post(
          'http://localhost:3000/api/notifications',
          { userId: commonUsers[u].id, title : "A book was returned!",message: `Check out the ${book.bookTitle}, it's available again!`, type: "info" },
          {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }
        );
      }
      const admins = result.data.data.users.filter(user => user.roles.includes(Roles.admin))
      for (let u = 0; u < admins.length; u++) {
        const notification = await axios.post(
          'http://localhost:3000/api/notifications',
          { userId: admins[u].id, title : "A book was returned!",message: `Check out the ${book.bookTitle}, it's available again!`, type: "info" },
          {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }
        );
      }
      fetchReserves(); // Recarregar reservas após a criação
    } catch (error) {
      console.error("Error validating the loan:", error);
      setPopUpList((prevList) => [
        ...prevList,
        { success: false, content: "Error validating the loan" },
      ]);
    }
  };

  const handleData = (id: string) =>{
    setIsValidateReturnModalOpen(true);
    setReserveId(id);
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
            <ReserveAdminTable
             onValidate={handleData}
            data={filteredBooks} />
          ) : (
            <p>No reserves found.</p>
          )}
          <ValidateReturnModal
          isOpen={isValidateReturnModalOpen}
          onClose={() => setIsValidateReturnModalOpen(false)}
          onCreate={handleValidation}
          />
        </div>
      </div>
      <div className={'popups'}>
        {popupList.map(pop =>
          <span key={pop.content} className={`popup ${pop.success ? 'success' : 'error'}`}>{pop.content}</span>
        )}
      </div>
    </Layout>
  );
};

export default ReserveAdminPage;
