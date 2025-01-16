import { Link } from "react-router-dom";
import styles from "./css/styles.module.css";

type Reservation = {
  id: string;
  bookId: string;
  bookTitle: string;
  status: "Reserved" | "waiting" | "Returned";
  dueDate: string;
  remainingDays: string;
  code: number;
};

type ReservationTableProps = {
  data: Reservation[];
  onDelete : (id) => void
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case "reserved":
      return styles.greenText;
    case "waiting":
      return styles.orangeText;
    case "returned":
      return styles.grayText;
    default:
      return "";
  }
};
const calculateRemainingDays = (dueDate: string): string => {
  const dueDateObj = new Date(dueDate); // Converte a data de entrega para um objeto Date
  const today = new Date(); // Obtém a data atual

  // Calcula a diferença em milissegundos
  const differenceInMs = dueDateObj.getTime() - today.getTime();

  // Converte a diferença para dias
  const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

  if (differenceInDays > 0) {
    return `${differenceInDays} days left`;
  } else if (differenceInDays === 0) {
    return "Due today";
  } else {
    return `${Math.abs(differenceInDays)} days late`;
  }
};

const getRemainingDaysClass = (remainingDays: string): string => {
  if (remainingDays.includes("left")) return styles.greenText;
  if (remainingDays.includes("late")) return styles.redText;
  return styles.grayText;
};

  // Deletar livro
 

const ReservationTable: React.FC<ReservationTableProps> = ({ data, onDelete }) => {
  return (
    <div className={styles.scrollable}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>Book</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}>Due Date</th>
            <th className={styles.headerCell}>Remaining Days</th>
            <th className={styles.headerCell}>Delivery Code</th>
            <th className={styles.headerCell}>Action</th>
          </tr>
        </thead>
        <tbody>
        {data.map((reservation) => (
            <tr key={reservation.id}>
              <td className={styles.cell}>
                <Link to={`/book/${reservation.bookId}`}>
                  {reservation.bookTitle}
                </Link>
                </td>
              <td className={`${styles.cell} ${getStatusClass(reservation.status)}`}>
                {reservation.status}
              </td>
              <td className={styles.cell}>{reservation.dueDate}</td>
              <td className={`${styles.cell} ${getRemainingDaysClass(calculateRemainingDays(reservation.dueDate))}`}>
                {calculateRemainingDays(reservation.dueDate)}
              </td>
              <td className={styles.cell}>{reservation.code}</td>
              <td className={styles.cell}><button type="button" className={styles.deleteButton} onClick={() => onDelete(reservation.id)}>
                  🗑️
                </button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
