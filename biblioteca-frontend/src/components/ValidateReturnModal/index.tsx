// components/ValidateReturnModal/ValidateReturnModal.tsx
import { useState } from "react";
import Modal from "../Modal";
import styles from "./css/styles.module.css";
import { useParams } from "react-router-dom";

interface ValidateReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (code: any) => void;
}

const ValidateReturnModal: React.FC<ValidateReturnModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [code, setCode] = useState<string>("");


  const handleSubmit = () => {
    onCreate(Number(code));
    onClose();
    setCode("");
 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Validate Delivery Book</h2>
      <div className={styles.formGroup}>
        <label htmlFor="loan">Delivery Code</label>
        <input name="loan" value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
    
      <button type="button" onClick={handleSubmit} className={styles.submitButton}>
        Validate
      </button>
    </Modal>
  );
};

export default ValidateReturnModal;
