// pages/BookPage/BookPage.tsx
import { useParams } from "react-router-dom";
import BookCard from "../../components/BookCard";
import styles from "./css/styles.module.css";
import Layout from "../Layout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Roles } from "../../utils/Roles";
import axios from "axios";

interface PopUp{
  success: boolean;
  content: string;
}

const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, accessToken } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [waitlist, setWaitlist] = useState(null);
  const [popupList, setPopUpList] = useState<PopUp[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca do livro
        const response = await axios.get(
          `http://localhost:3000/api/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setBook(response.data.data.book);
        if (user?.roles[0] === Roles.admin) {
          // Busca da lista de espera
          const result = await axios.get(
            `http://localhost:3000/api/waitlist/${id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          
          // Resolução dos usuários na lista de espera
          const list = await Promise.all(
            result?.data.data.waitlist.map(async (waiter) => {
              try {
                const userResponse = await axios.get(
                  `http://localhost:3000/api/users/${waiter.userId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  },
                );
                return {
                  ...waiter,
                  username: userResponse.data.data.user.username,
                };
              } catch (error) {
                console.error(`Error fetching user ${waiter.userId}:`, error);
                return {
                  ...waiter,
                  username: "Unknown",
                }; // Retorna um valor padrão se houver erro
              }
            }),
          );
          setWaitlist(list);
        }
        
      } catch (error) {
        console.error("Error fetching book", error);
        throw new Error("Failed to fetch book.");
      }
    }
    fetchData();
  }, []);

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

  const isAdmin = user?.roles[0] === Roles.admin ? true : false;

  if (!book) {
    return <p className={styles.notFound}>Book not found.</p>;
  }

  const handleReserve = async () => {
    try{
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);
      const loansResponse = await axios.post('http://localhost:3000/api/loans',
        {userId: user?.id, bookId: id, dueDate },
        {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if(loansResponse.status < 400){
        setPopUpList((prevList) => [
          ...prevList,
          { success: true, content: "Loan created successfully" },
        ]);
      }else{
        setPopUpList((prevList) => [
          ...prevList,
          { success: false, content: "Error creating a loan" },
        ]);
      }
      const notificationToUser = await axios.post(
        'http://localhost:3000/api/notifications',
        { userId: user.id, title : "You made it!",message: `You just loan the ${book.title}, due this book until ${dueDate}! Check yours reserves to see more details.`, type: "info" },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      const admins = await axios.get(
        'http://localhost:3000/api/users',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      console.log(popupList)
      const adminList = admins.data.data.users.filter(user => user.roles === Roles['admin'])
      adminList.forEach(async (admin) => {
        
        const notificationToAdmins = await axios.post(
          'http://localhost:3000/api/notifications',
          { userId: admin.id, title : "New Reserve was made",message: `${user?.username} just loan the ${book.title}, he should due this book until ${dueDate}! Check the reserves to see more details.`, type: "info" },
          {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }
        );
      });
    }catch(err){
      console.error(err?.message)
      setPopUpList((prevList) => [
        ...prevList,
        { success: false, content: "Error processing the reservation." },
      ]);
    }
  };

 
  return (
    <Layout>
      <div className={styles.page}>
        <BookCard
          isAdmin={isAdmin}
          title={book.title}
          author={book.author}
          isAvailable={book.status}
          description={book.description}
          imageUrl={book.imageUrl}
          onReserve={handleReserve}
        />
        {isAdmin && (
          <div className={styles.waitlistContainer}>
            <h3 className={styles.waitlistTitle}>Waitlist</h3>
            <ul className={styles.waitlist}>
              {waitlist?.map((waiter) => (
                <li key={waiter.id} className={styles.waitlistItem}>
                  {waiter.username}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={'popups'}>
        {popupList.map(pop =>
          <span key={pop.content} className={`popup ${pop.success ? 'success' : 'error'}`}>{pop.content}</span>
        )}
      </div>
    </Layout>
  );
};

export default BookPage;
