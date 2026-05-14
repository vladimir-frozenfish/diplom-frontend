import { useState } from 'react'
import type { FormEvent } from 'react'
import type { HallType } from '../../types/types.ts'
import { basePath } from '../../enum/enum.ts'
// import { QRCode } from 'react-qr-code'
import Button from '../../utils/button/Button.tsx'
import styles from './HallManagement.module.css'
import stylesAdminForm from  '../../css/FormAdmin.module.css'

interface HallManagementProps {
  halls: HallType[] | undefined
  // selectedDate: Date
  // selectedSeance: SeanceWithHallType | null
  // selectedFilm: FilmType | null
  // selectedHall: HallType | null
  // ticketsBooking: TicketBookingType[] | null
}

export default function HallManagement({halls}: HallManagementProps) {
  const [isAddHall, setIsAddHall] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsAddHall(false)
    // const form = new FormData(e.currentTarget)

    // try {
    //   const response = await getResponseFromForm('/login', 'POST', form)
    //   const data = await response.json()

    //   if (data.success && data.result == 'Авторизация пройдена успешно!') {
    //     setIsAuth(true)
    //   } else {
    //     setIsAuthError(true)
    //   }
    // } catch(e) {
    //   console.error(e)
    // }    
  }

  function onReset() {
    setIsAddHall(false)
  }

  return (
      <div>
        <div>Доступные залы:</div>
        <ul className={styles.hall_management_halls}>
          {halls && halls.length > 0 ? (
            halls.map((hall, index) => (
              <li key={index}>
                <div>{hall.hall_name}</div>
                <div className={styles.hall_management_delete}>
                  <img src={basePath + '/delete.svg'} alt="Удалить" />
                </div>
              </li>
            ))
          ) : (<li>Залов не найдено</li>)}
        </ul>
        <div className={styles.hall_management_buttons}>
          <Button text='СОЗДАТЬ ЗАЛ' onClick={() => {setIsAddHall(true)}} />
        </div>
        
        {isAddHall && 
          <div className={stylesAdminForm.admin_form_modal}>
            <div className={stylesAdminForm.admin_form_container}>
              <div className={stylesAdminForm.admin_form_header}>ДОБАВЛЕНИЕ ЗАЛА</div>
              <form className={stylesAdminForm.admin_form} onSubmit={onSubmit} onReset={onReset}>
                <div  className={stylesAdminForm.admin_form_fields}>
                  <div className={stylesAdminForm.admin_form_description}>Название зала</div>
                  <input placeholder='Зал 1' name='hallName' className={stylesAdminForm.admin_form_input}/>
                </div>

                <div className={stylesAdminForm.admin_form_buttons}>
                  <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>ДОБАВИТЬ ЗАЛ</button>
                  <button type="reset" className={stylesAdminForm.admin_form_button}>ОТМЕНИТЬ</button>
                </div>                
              </form>
            </div>
          </div>
        }
      </div>
  )
}