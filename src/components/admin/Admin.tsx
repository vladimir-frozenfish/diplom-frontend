import { useState } from "react"
import { NavLink } from "react-router"
import Auth from "../auth/Auth"
import styles from './Admin.module.css'

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false)

  return (
      <div className={styles.admin}>
        <div className={styles.admin_container}>
          <div className={styles.admin_header}>
            <NavLink to='/admin' reloadDocument className={styles.admin_logo_link}>
              <div className={styles.admin_logo}>ИДЁМ<span>В</span>КИНО</div>
              <div className={styles.admin_logo_title}>АДМИНИСТРАТОРРРСКАЯ</div>
            </NavLink>
          </div>

        {!isAuth 
          ? <Auth setIsAuth={(auth) => setIsAuth(auth)}/>
          : <div>Админ часть</div>
        }
        </div>
      </div>
  )
}