import styles from "./css/styles.module.css";

type Notification = {
  type: "info" | "warn";
  title: string;
  message: string;
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
            <th className={styles.headerCell}>Message</th>
          </tr>
        </thead>
        <tbody>
          {data.map((notification, index) => (
            <tr key={index}>
              <td className={styles.cell}>
                <span className={styles.icon}><img src={notification.type === "info"? "/icons/info.svg":"/icons/warn.svg"} alt="" /></span> {notification.title}
              </td>
              <td className={styles.cell}>{notification.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationsTable;
