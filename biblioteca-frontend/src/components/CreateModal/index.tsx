// components/CreateBookModal/CreateBookModal.tsx
import { useState } from "react";
import Modal from "../Modal";
import styles from "./css/styles.module.css";

interface CreateBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string,author: string, isbn: string, description: string, releaseDate: string) => void;
}

const CreateBookModal: React.FC<CreateBookModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const handleSubmit = () => {
    onCreate(title,author, isbn, description, releaseDate);
    onClose();
    setTitle("");
    setAuthor("");
    setIsbn("");
    setDescription("");
    setReleaseDate("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Create New Book</h2>
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
        <label htmlFor="ISBN">ISBN</label>
        <input name="ISBN" placeholder="Book ISBN..." value={isbn} onChange={(e) => setIsbn(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="date">Release Date</label>
        <input
          placeholder="27 feb, 24"
          name="date"
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
      </div>
      <button type="button" onClick={handleSubmit} className={styles.submitButton}>
        Create
      </button>
    </Modal>
  );
};

export default CreateBookModal;
