import { NavLink } from "react-router"
import Index from "./components/index/Index"
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <div className={styles.app_container}>
        <div className={styles.app_header}>
          <NavLink to='/'><div className={styles.app_logo}>ИДЁМ<span>В</span>КИНО</div></NavLink>
          <NavLink to='/admin'><div className={styles.app_signin}>ВОЙТИ</div></NavLink>
        </div>
        
        <Index />
      </div>
    </div>
    )
  }
