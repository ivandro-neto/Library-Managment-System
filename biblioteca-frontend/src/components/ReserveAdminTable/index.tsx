import styles from "./css/styles.module.css";

type Reservation = {
  book: string;
  status: "Reserved" | "waiting" | "Returned";
  dueDate: string;
  remainingDays: string;
  deliveryCode: string;
};

type ReservationTableProps = {
  data: Reservation[];
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case "Reserved":
      return styles.greenText;
    case "waiting":
      return styles.orangeText;
    case "Returned":
      return styles.grayText;
    default:
      return "";
  }
};

const getRemainingDaysClass = (remainingDays: string): string => {
  if (remainingDays.includes("left")) return styles.greenText;
  if (remainingDays.includes("late")) return styles.redText;
  return styles.grayText;
};

const ReservationTable: React.FC<ReservationTableProps> = ({ data }) => {
  return (
    <div className={styles.scrollable}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>Book</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}>Due Date</th>
            <th className={styles.headerCell}>Remaining Days</th>
            <th className={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((reservation, index) => (
            <tr key={index}>
              <td className={styles.cell}>{reservation.book}</td>
              <td className={`${styles.cell} ${getStatusClass(reservation.status)}`}>
                {reservation.status}
              </td>
              <td className={styles.cell}>{reservation.dueDate}</td>
              <td className={`${styles.cell} ${getRemainingDaysClass(reservation.remainingDays)}`}>
                {reservation.remainingDays}
              </td>
              <td className={styles.cell}>
                <button type="button" className={styles.validationButton} onClick={() => alert("Hey")}> <img src="/icons/check.svg" alt="" /> Validate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
