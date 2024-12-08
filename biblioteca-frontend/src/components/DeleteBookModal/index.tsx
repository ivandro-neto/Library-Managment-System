// components/DeleteBookModal/DeleteBookModal.tsx
import Modal from "../Modal";
import styles from "./css/styles.module.css";

interface DeleteBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteBookModal: React.FC<DeleteBookModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this book?</p>
      <div className={styles.actions}>
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className={styles.confirmButton}>
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteBookModal;
