import ReservationTable from "../../components/ReserveTable";
import Layout from "../Layout";
import styles from "./css/styles.module.css";

const latestReserves = [
];

const waitingReserves = [...latestReserves]; // Reutilizando os mesmos dados para fins de exemplo
const historyReserves = [...latestReserves]; // Reutilizando os mesmos dados para fins de exemplo

const ReservesPage: React.FC = () => {
  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Latest Reserves</h2>
          <ReservationTable data={latestReserves} />
        </div>

        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Waiting</h2>
          <ReservationTable data={waitingReserves} />
        </div>

        <div className={styles.group}>
          <h2 className={styles.groupTitle}>History</h2>
          <ReservationTable data={historyReserves} />
        </div>
      </div>
    </Layout>
  );
};

export default ReservesPage;
