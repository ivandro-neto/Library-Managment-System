import { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import styles from './css/styles.module.css';
import Layout from "../Layout";
import BookContainer from "../../components/BookContainer";
import { AuthContext } from "../../context/AuthContext";
import SearchBar from "../../components/SearchInput";
import { Roles } from "../../utils/Roles";

interface PopUp{
  success: boolean;
  content: string;
}

const LibraryPage = () => {
  const { accessToken, user } = useContext(AuthContext);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [query, setQuery] = useState<string>('');
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
  useEffect(() => {
    if (!query) {
      setFilteredBooks(books); // Exibe todos os livros se não houver consulta
    } else {
      const results = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(results); // Atualiza a lista filtrada
    }
  }, [query, books]);

  const apiBaseURL = "http://localhost:3000/api";

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${apiBaseURL}/books`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setBooks(response.data.data.books);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to load books.");
      setLoading(false);
    }
  };

  const handleCreateLoan = async (user, book) => {
    try {

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);
      const loansResponse = await axios.post('http://localhost:3000/api/loans',
        {userId: user?.id, bookId: book.id, dueDate },
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
      const notification = await axios.post(
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
    
      const adminList = admins.data.data.users.filter(user => user.roles.includes(Roles['admin']))
      adminList.forEach(async (admin) => {
        
        const notificationToAdmins = await axios.post(
          'http://localhost:3000/api/notifications',
          { userId: admin.id, title : "New Reserve was made",message: `${user?.username} just loan the ${book.title}, he should due this book until ${dueDate}! Check the reserves to see more details.`, type: "info" },
          {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }
        );
      });
    } catch (err) {
      console.error('Error creating loan:', err);
      setPopUpList((prevList) => [
        ...prevList,
        { success: false, content: "Error creating a loan" },
      ]);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchBooks();
    }
  }, [accessToken]);

  if (loading) {
    return (
      <Layout>
        <div className={styles.header}>
        <SearchBar onSearch={setQuery} /> 
      </div>
        <div className={styles.container}>
          <p>Loading books...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
         <div className={styles.header}>
        <SearchBar onSearch={setQuery} /> 
      </div>
      <div className={styles.container}>
          <p>{error}</p>
      </div>
       
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.header}>
        <SearchBar onSearch={setQuery} /> {/* Passa a função para atualizar a query */}
      </div>
      <div className={styles.container}>
        {filteredBooks.map((book: any) => (
          <BookContainer
            key={book.id}
            image={book.image}
            title={book.title}
            author={book.author}
            url={book.id}
            status={book.status}
            onReserve={() => handleCreateLoan(user, book)}
          />
        ))}
      </div>
      <div className={'popups'}>
        {popupList.map(pop =>
          <span key={pop.content} className={`popup ${pop.success ? 'success' : 'error'}`}>{pop.content}</span>
        )}
      </div>
    </Layout>
  );
};

export default memo(LibraryPage);
