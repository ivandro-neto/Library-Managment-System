// components/LibraryTable/LibraryTable.tsx
import { useEffect, useState } from "react";
import styles from "./css/styles.module.css";
import { Link } from "react-router-dom";

interface Book {
  id: string;
  title: string;
  status: "Available" | "Reserved" | "Waiting";
  releaseDate: string;
}

interface LibraryTableProps {
  books: Book[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const LibraryTable: React.FC<LibraryTableProps> = ({ books,onCreate, onEdit, onDelete }) => {
  const [book, setBook] = useState(books)


  useEffect(()=>{
    setBook(books)
  }, [books])
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Available books</h2>
        <button type="button" onClick={onCreate} className={styles.addButton}>+ Add book</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Book</th>
            <th>Status</th>
            <th>Release Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {book.map((b) => (
            <tr key={b.id}>
              <td>
              <Link to={`/book/${b.id}`}>
                {b.title}
              </Link>
                </td>
              <td
                className={`${styles.status} ${
                  b.status === "Available"
                    ? styles.available
                    : b.status === "Reserved"
                    ? styles.reserved
                    : styles.waiting
                }`}
              >
                {b.status}
              </td>
              <td>{b.releaseDate}</td>
              <td className={styles.actions}>
                <button type="button" className={styles.editButton} onClick={() => onEdit(b.id)}>
                  ✏️
                </button>
                <button type="button" className={styles.deleteButton} onClick={() => onDelete(b.id)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LibraryTable;
