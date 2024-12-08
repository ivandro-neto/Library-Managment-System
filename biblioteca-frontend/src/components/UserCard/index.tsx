import { useContext } from "react";
import { Expanded } from "../Account";
import styles from "./css/styles.module.css";
import { AuthContext } from "../../context/AuthContext";


const UserCard = ({user}) =>{
  const {logout} = useContext(AuthContext)

  return(
    <div className={styles.container}>
      <Expanded image="" accountname={user.username} email={user.email}/>
      <button type="button" title="exit" className={styles.exit} onClick={()=> logout()}><img src="/icons/exit.svg" alt="" /></button>
    </div>
  )
}

export default UserCard