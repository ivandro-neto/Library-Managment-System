import styles from "./css/styles.module.css";

type Notification = {
  type: "Atraso na entrega" | "Livro disponível";
  bookTitle: string;
  description: string;
  icon: string; // Emoji representando o ícone
};

type NotificationsTableProps = {
  data: Notification[];
};

const NotificationsTable: React.FC<NotificationsTableProps> = ({ data }) => {
  return (
    <div className={styles.scrollable}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>Notification</th>
            <th className={styles.headerCell}>Book title</th>
            <th className={styles.headerCell}>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((notification, index) => (
            <tr key={index}>
              <td className={styles.cell}>
                <span className={styles.icon}><img src={notification.icon} alt="" /></span> {notification.type}
              </td>
              <td className={styles.cell}>{notification.bookTitle}</td>
              <td className={styles.cell}>{notification.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationsTable;
