import { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import styles from './css/styles.module.css';
import Layout from "../Layout";
import BookContainer from "../../components/BookContainer";
import { AuthContext } from "../../context/AuthContext";
import { createLoan } from "../../api/book";
import SearchBar from "../../components/SearchInput";

const LibraryPage = () => {
  const { accessToken, user } = useContext(AuthContext);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [query, setQuery] = useState<string>('');

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

      const result = await createLoan({
        userId: user.id,
        bookId: book.id,
        dueDate,
      });

        const notification = await axios.post(
          `${apiBaseURL}/notifications`,
          { userId: user.id, title : "You made it!",message: `You just loan the ${book.title}, due this book until ${dueDate}! Check yours reserves to see more details.`, type: "info" },
          {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          }
        );
        console.log("SENT!", notification)

      console.log('Loan created successfully:', result);
    } catch (err) {
      console.error('Error creating loan:', err);
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
    </Layout>
  );
};

export default memo(LibraryPage);
