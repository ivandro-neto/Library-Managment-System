import { useContext } from 'react';
import { LinkButton } from '../Button';
import UserCard from '../UserCard';
import styles from './css/styles.module.css'
import { AuthContext } from '../../context/AuthContext';
import { Roles } from '../../utils/Roles';

const SideNav = () => {
  const {user} = useContext(AuthContext)
  const isAdmin = user?.roles[0] === Roles.admin? true: false;
  return (
    <section className={styles.container}>
      <div className={styles.appName}>
        <img src="/logo.svg" alt="" className={styles.logo} />
        <h1>Library App</h1>
      </div>
    <nav className={styles.navbar}>
      <ul className={styles.list}>
        <li className={styles.items}>
          <LinkButton url={isAdmin ?'/admin/library': '/library'} content={'Library'}/>
        </li>
        <li className={styles.items}>
          <LinkButton url={'/inbox'} content={'Inbox'}/>
        </li>
        <li className={styles.items}>
          <LinkButton url={isAdmin ?'/admin/reserves': '/reserves'} content={'Reserves'}/>
        </li>
      </ul>

      <div className={styles.user}>
        <UserCard user={user}/>
      </div>
    </nav>
    </section>
  )
}

export default SideNav;