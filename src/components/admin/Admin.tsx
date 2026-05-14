import { useState, useEffect } from "react"
import { NavLink } from "react-router"
import { getResponse } from '../../utils/response'
import type { AllDataType } from '../../types/types.ts'
import UpDownContainer from "../../utils/upDownContainer/UpDownContainer.tsx"
import Auth from "../auth/Auth"
import HallManagement from "../hallManagement/HallManagement.tsx"
import styles from './Admin.module.css'

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false)
  const [allData, setAllData] = useState<AllDataType | null>(null)
  const [isErrorResponse, setIsErrorResponse] = useState(false)
  const [isLoading, setIsLoading] = useState(false)  

  useEffect(() => {
    (async () => {
      if (isAuth) {
        setIsLoading(true)
        try {
          const response = await getResponse('/alldata')
          setAllData(await response.json())
          setIsLoading(false)
        } catch (e) {
          console.error(e)
          setIsErrorResponse(true)
        }
      }
    })()
  }, [isAuth])  

  if (isErrorResponse) {
    return (
      <div className={styles.admin}>
        <div className={styles.admin_container}><div>Ошибка получения данных.</div></div>
      </div>
  )}

  if (isLoading) {
    return (
      <div className={styles.admin}>
        <div className={styles.admin_container}><div>Загрузка...</div></div>
      </div>
  )}

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
          : 
            <>
              <UpDownContainer description="УПРАВЛЕНИЕ ЗАЛАМИ" isFirst={true}>
                <HallManagement halls={allData?.result.halls}/>
              </UpDownContainer>
              
              <UpDownContainer description="КОНФИГУРАЦИЯ ЗАЛОВ">
                <div>Выберите зал для конфигурации:</div>
              </UpDownContainer>              
            </>
        }
        </div>
      </div>
  )
}