import { Link } from 'react-router-dom';
import styles from './css/styles.module.css'

interface ILink{
  url: string;
  content: string;
}

interface IActions {
  action: () => void;
  content: string;
  disabled?: boolean;  // Optional disabled prop
}


export const LinkButton = ({url, content} : ILink) => {
  return (
    <Link to={url} className={styles.link}>
      {content}
    </Link>
  )
}

export const RegularButton = ({ action, content, disabled = false }: IActions) => {
  return (
    <button
      type="button"
      className={`${styles.regular} ${disabled ? styles.disabled : ''}`}
      onClick={action}
      disabled={disabled}  // Ensure button is disabled properly
    >
      {content}
    </button>
  );
};