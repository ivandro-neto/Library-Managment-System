// components/UpdateBookModal/UpdateBookModal.tsx
import { useState } from "react";
import Modal from "../Modal";
import styles from "./css/styles.module.css";

interface UpdateBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: { id: string; title: string,author: string, isbn: string, description: string, quantity: number, status:string, releaseDate: string };
  onUpdate: (id: string,title: string,author: string, isbn: string, description: string, quantity: number, status:string, releaseDate: string) => void;
}

const UpdateBookModal: React.FC<UpdateBookModalProps> = ({ isOpen, onClose, book, onUpdate }) => {
  const [title, setTitle] = useState(book.title);
  const [isbn, setIsbn] = useState(book.isbn);
  const [author, setAuthor] = useState(book.author);
  const [description, setDescription] = useState(book.description);
  const [quantity, setQuantity] = useState(book.quantity);
  const [status, setStatus] = useState(book.status);
  const [releaseDate, setReleaseDate] = useState(book.releaseDate);

  const handleSubmit = () => {
    onUpdate(book.id, title, author, isbn, description,quantity, status, releaseDate);
    setAuthor("");
    setTitle("");
    setDescription("");
    setStatus("");
    setReleaseDate("");
    setQuantity(0);
    setIsbn("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Update Book</h2>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input name="title" placeholder="Book title..." value={title} onChange={(e) => setTitle(e.target.value)} />
      </div> 
      <div className={styles.formGroup}>
        <label htmlFor="author">Author</label>
        <input name="author" placeholder="Book author..." value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="state">description</label>
        <textarea id="state" value={description} onChange={(e) => setDescription(e.target.value)}>
        </textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="quatity">Quantity</label>
        <input name="quatity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="ISBN">ISBN</label>
        <input name="ISBN" placeholder="Book ISBN..." value={isbn} onChange={(e) => setIsbn(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="state">Status</label>
        <select id="state" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="waiting">Waiting</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="date">Release Date</label>
        <input
          name="date"
          title="release date"
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
      </div>
      <button type="button" onClick={handleSubmit} className={styles.submitButton}>
        Update
      </button>
    </Modal>
  );
};

export default UpdateBookModal;
