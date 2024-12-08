import { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import styles from './css/styles.module.css';
import Layout from "../Layout";
import BookContainer from "../../components/BookContainer";
import { AuthContext } from "../../context/AuthContext";
import { createLoan } from "../../api/book";

const LibraryPage = () => {
  const {accessToken, user} = useContext(AuthContext)
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseURL = "http://localhost:3000/api";  // Defina sua URL base aqui

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${apiBaseURL}/books`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Passando o token no header
        },
      });

      if(response)
        setLoading(false)
      setBooks(response.data.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleCreateLoan = async (user, book) => {
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15); // Adiciona 15 dias à data atual
  
      const result = await createLoan({
        userId: user.id,
        bookId: book.id,
        dueDate,
      });
      console.log('Loan created successfully:', result);
    } catch (err) {
      console.error('Error creating loan:', err);
    }
  };
  

  // Carregar livros quando o componente for montado ou quando o token mudar
  useEffect(() => {
    if (accessToken) {
      fetchBooks();
    }
  }, [accessToken]);


  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>Loading books...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        {books.map((book: any) => (
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
    </Layout>
  );
};

export default memo(LibraryPage);
