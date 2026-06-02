import { useState } from 'react'
import type { FormEvent, Dispatch, SetStateAction } from 'react'
import type { HallType } from '../../types/types.ts'
import { getResponseFromForm } from '../../utils/response.ts'
import LoadingModal from '../../utils/loadingModal/LoadingModal.tsx'
import Button from '../../utils/button/Button.tsx'
import styles from './SalesManagement.module.css'
import stylesAdminForm from  '../../css/FormAdmin.module.css'

interface SalesManagementProps {
  halls: HallType[] | undefined
  setIsUpdateData: Dispatch<SetStateAction<boolean>>
}

export default function SalesManagement({halls, setIsUpdateData}: SalesManagementProps) {
  const [isConfirmSales, setIsConfirmSales] = useState(false)
  const [currentHall, setCurrentHall] = useState<HallType | null >(halls ? halls[0] : null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSalesError, setIsSalesError] = useState(false)

  function onClickHall(hall: HallType) {
    setCurrentHall(hall)
    console.log(hall.hall_open)
  }

  async function onConfirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const form = new FormData()
    form.set('hallOpen', currentHall?.hall_open ? '0' : '1')

    try {
      const response = await getResponseFromForm(`/open/${currentHall?.id}`, 'POST', form)
      const data = await response.json()

      if (data.success) {
        setIsConfirmSales(false)
        setIsUpdateData((current) => !current)
      } else {
        setIsSalesError(true)
      }
      
    } catch(e) {
      console.error(e)
    }
    
    setIsLoading(false)
  }

  function onResetConfirm() {
    setIsConfirmSales(false)
    setIsSalesError(false)
  }

  return (
      <div>
        <div>Выберите зал для открытия/закрытия продаж:</div>
        <div className={styles.sales_configuration_nav}>
          {halls && halls.length > 0 ? (
            halls.map((hall, index) => (
              <div 
                className={currentHall?.id === hall.id ? styles.sales_configuration_nav_button + ' ' + styles.sales_configuration_nav_button_current : styles.sales_configuration_nav_button} 
                key={index} 
                onClick={() => onClickHall(hall)}
              >
                {hall.hall_name}
              </div>
            ))
          ) : (<div>Залов не найдено</div>)}
        </div>

        <div className={styles.sales_configuration_title}>{!currentHall?.hall_open ? 'Всё готово к открытию' : 'Можно закрыть зал'}</div>

        <div className={styles.sales_configuration_buttons}>
          <Button text={!currentHall?.hall_open ? 'ОТКРЫТЬ ПРОДАЖУ БИЛЕТОВ' : 'ЗАКРЫТЬ ПРОДАЖУ БИЛЕТОВ'} onClick={() => {if (currentHall) setIsConfirmSales(true)}} />
        </div>

        {isConfirmSales && 
          <div className={stylesAdminForm.admin_form_modal}>
            <div className={stylesAdminForm.admin_form_container}>
              <div className={stylesAdminForm.admin_form_header}>{!currentHall?.hall_open ? 'ОТКРЫТЬ ПРОДАЖУ БИЛЕТОВ' : 'ЗАКРЫТЬ ПРОДАЖУ БИЛЕТОВ'}</div>
              <form className={stylesAdminForm.admin_form} onSubmit={onConfirm} onReset={onResetConfirm}>
                <div className={stylesAdminForm.admin_form_caption}>{!currentHall?.hall_open ? 'Открыть продажу билетов' : 'Закрыть продажу билетов'} в зале <span>{currentHall?.hall_name}</span></div>

                <div className={stylesAdminForm.admin_form_buttons}>
                  <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>{!currentHall?.hall_open ? 'ОТКРЫТЬ' : 'ЗАКРЫТЬ'}</button>
                  <button type="reset" className={stylesAdminForm.admin_form_button}>ОТМЕНИТЬ</button>
                </div>

                {isSalesError && <div className={stylesAdminForm.admin_form_error}>Ошибка при открытии / закрытии продаж.</div>}
              </form>
            </div>
          </div>
        }            

        {isLoading && <LoadingModal />}
      </div>
  )
}