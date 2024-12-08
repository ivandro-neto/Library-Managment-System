import ReserveAdminTable from "../../components/ReserveAdminTable";
import Layout from "../Layout";
import styles from "./css/styles.module.css";

const latestReserves = [];


const ReserveAdminPage: React.FC = () => {
  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Latest Reserves</h2>
          <ReserveAdminTable data={latestReserves} />
        </div>
      </div>
    </Layout>
  );
};

export default ReserveAdminPage;
