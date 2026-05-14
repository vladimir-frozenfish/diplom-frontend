// import { useState } from 'react'
import type { HallType } from '../../types/types.ts'
import { basePath } from '../../enum/enum.ts'
// import { QRCode } from 'react-qr-code'
import Button from '../../utils/button/Button.tsx'
import styles from './HallManagement.module.css'

interface HallManagementProps {
  halls: HallType[] | undefined
  // selectedDate: Date
  // selectedSeance: SeanceWithHallType | null
  // selectedFilm: FilmType | null
  // selectedHall: HallType | null
  // ticketsBooking: TicketBookingType[] | null
}

export default function HallManagement({halls}: HallManagementProps) {

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
          <Button text='СОЗДАТЬ ЗАЛ' onClick={() => {}} />
        </div>
      </div>
  )
}