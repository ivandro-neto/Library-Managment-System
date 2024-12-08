import styles from './css/styles.module.css';
import { LinkButton, RegularButton } from '../Button';

interface BookContainerProps {
  image: string;
  title: string;
  author: string;
  url: string;
  status: string;
  onReserve: () => void;
}

const BookContainer = ({url, image, title, author, status, onReserve }: BookContainerProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} loading="lazy" className={styles.image} />
      </div>
      <div className={styles.details}>
        <p className={styles.title}>{title} - {author}</p>
        <div className={styles.row}>
          <span className={`${styles.status} ${status === 'Available' ? styles.available : styles.unavailable}`}>
            {status}
          </span>
          <LinkButton url={`/book/${url}`} content={"View"}/>
          <RegularButton
            content="Reserve"
            action={onReserve}
            disabled={status !== 'available'} // Disable button if the book is unavailable
          />
        </div>
      </div>
    </div>
  );
};

export default BookContainer;