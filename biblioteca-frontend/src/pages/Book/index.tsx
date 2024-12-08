// pages/BookPage/BookPage.tsx
import { useParams } from "react-router-dom";
import BookCard from "../../components/BookCard";
import styles from "./css/styles.module.css";
import Layout from "../Layout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Roles } from "../../utils/Roles";
import axios from "axios";



const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const {user, accessToken} = useContext(AuthContext) 
  const[book, setBook] = useState(null);
  
  useEffect(()=>{
    async function fetchData() {
      
      try {
        const response = await axios.get(`http://localhost:3000/api/books/${id}`,{
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Adicionando o token no header
          },
        });
       
        setBook(response.data.data.book)
      } catch (error) {
        console.error("Error fetching book", error);
        throw new Error("Failed to fetch book.");
      }
    }
    fetchData();
  }, [])
  
  const isAdmin = user?.roles[0] === Roles.admin? true: false;

  if (!book) {
    return <p className={styles.notFound}>Book not found.</p>;
  }

  const handleReserve = () => {
    alert(`You have reserved the book: ${book.title}`);
  };

  return (
    <Layout>
      <div className={styles.page}>
        <BookCard
          isAdmin = {isAdmin}
          title={book.title}
          author={book.author}
          isAvailable={book.isAvailable}
          description={book.description}
          imageUrl={book.imageUrl}
          onReserve={handleReserve}
        />
        {isAdmin && (
          <div className={styles.waitlistContainer}>
            <h3 className={styles.waitlistTitle}>Waitlist</h3>
            <ul className={styles.waitlist}>
              {book.waitlist.map((name, index) => (
                <li key={index} className={styles.waitlistItem}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookPage;
