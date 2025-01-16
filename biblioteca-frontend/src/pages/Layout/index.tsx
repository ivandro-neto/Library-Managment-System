import { memo, ReactNode } from 'react'
import SideNav from '../../components/SideNav'
import styles from './css/styles.module.css'
import SearchBar from '../../components/SearchInput';
interface ILayoutProps{
  children : ReactNode;
  
}


const Layout: React.FC<ILayoutProps> = ({children}) => {
  const handleSearch = (query: string) => {
    // Perform search logic (e.g., API call or filter a book list)
  };
  return(
    <div className={styles.container}>
      <SideNav/>
      <div className={styles.mainContainer}>
      <main className={styles.main}>
        {children}
      </main>
      </div>
    </div>
  )
}

export default memo(Layout)