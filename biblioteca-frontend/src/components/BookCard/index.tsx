// components/BookCard/BookCard.tsx
import { RegularButton } from "../Button";
import styles from "./css/styles.module.css";

interface BookCardProps {
  title: string;
  isAdmin: boolean;
  author: string;
  isAvailable: boolean;
  description: string;
  imageUrl: string;
  onReserve: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ isAdmin, title, author, isAvailable, description, imageUrl, onReserve }) => {
  return (
    <div className={styles.card}>
       <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} loading="lazy" className={styles.image} />
      </div>
      <div className={styles.info}>
        <h2>{title} - <span className={styles.author}>{author}</span></h2>
        <div className={styles.row}>
          <p className={styles.status} style={{ color: isAvailable ? "green" : "red" }}>
            {isAvailable ? "Available" : "Unavailable"}
          </p>
          {isAvailable && isAdmin === false? (
            <RegularButton action={onReserve} content={"Reserve"}/>
          ): <></>}
        </div>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default BookCard;
