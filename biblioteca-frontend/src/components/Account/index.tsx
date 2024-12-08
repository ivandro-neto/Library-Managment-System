import styles from './css/style.module.css';
import AccountIcon from "../AccountIcon"

interface IExpandedProps{
  image:string;
  accountname: string;
  email: string;
}
interface IShortProps{
  image:string;
  accountname: String;
}


export const Short = ({ image, accountname } : IShortProps) => {
  return (
    <div className={styles.shortContainer}>
      <p className={styles.shortAccountName}>{accountname}</p>
      <AccountIcon name={accountname} avatarImage={image}/>
    </div>
  );
}

export const Expanded = ({ image, accountname, email } : IExpandedProps) => {
  return (
    <div className={styles.expandedContainer}>
      <AccountIcon name={accountname} avatarImage={image}/>
      <div className={styles.accountInfo}>
        <p className={styles.expandedAccountName}>{accountname}</p>
        <p className={styles.expandedLocation}>{email}</p>
      </div>
    </div>
  );
}

