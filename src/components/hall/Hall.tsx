import { useEffect, useState } from 'react'
import type { FilmType, HallType, SeanceWithHallType, DateHallConfig, SeatType } from '../../types/types.ts'
import { getResponse } from '../../utils/response.ts'
import { basePath } from '../../enum/enum.ts'
import styles from './Hall.module.css'
import { data } from 'react-router'

interface HallProps {
  selectedDate: Date
  selectedSeance: SeanceWithHallType | null
  selectedFilm: FilmType | null
  selectedHall: HallType | null
}

interface SeatProps {
  seat: SeatType
  rowIndex: number
  seatIndex: number
}

export default function Hall({selectedDate, selectedSeance, selectedFilm, selectedHall}: HallProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isErrorResponse, setIsErrorResponse] = useState(false)
  const [hallConfig, setHallConfig] = useState<DateHallConfig | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const response = await getResponse(`/hallconfig?seanceId=${selectedSeance?.id}&date=${selectedDate.toISOString().split('T')[0]}`)
        let temp = await response.json()
        console.log(temp)
        // setHallConfig(await response.json())
        setHallConfig(temp)
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        setIsErrorResponse(true)
      }
    })()
  }, [])
  
  if (isErrorResponse) {
    return (<div>Ошибка получения данных.</div>)
  }

  if (isLoading) {
    return (<div>Загрузка...</div>)
  }  

  function Seat({seat, rowIndex, seatIndex}: SeatProps) {
    let seatStyle = styles.hall_seat
    if (seat == 'vip') seatStyle += ' ' + styles.hall_seat_vip
    if (seat == 'disabled') seatStyle += ' ' + styles.hall_seat_disabled
    if (seat == 'taken') seatStyle += ' ' + styles.hall_seat_taken
    
    return (
      <div className={seatStyle}></div>
    )
  }

  return (
      <div className={styles.hall}>
        <div className={styles.hall_title}>
          <div className={styles.hall_title__bold}>{selectedFilm?.film_name}</div>
          <div className={styles.hall_title__light}>Дата: {selectedDate.toLocaleDateString('ru-Ru')}</div>
          <div className={styles.hall_title__light}>Начало сеанса: {selectedSeance?.seance_time}</div>
          <div className={styles.hall_title__bold}>{selectedHall?.hall_name ? selectedHall?.hall_name.charAt(0).toUpperCase() + selectedHall?.hall_name.slice(1) : '-'}</div>
        </div>

        <div className={styles.hall_schema_bg}>
          <div className={styles.hall_schema}>
            <div className={styles.hall_schema__screen}>
              <img className={styles.hall_schema__screen} src={basePath + '/hall_screen.png'} />
            </div>

            <div className={styles.hall_selection_seats}>
              {hallConfig?.result.map((hallrow, rowIndex) => 
                <div key={rowIndex} className={styles.hall_selection_seats_row}>{hallrow.map((seat, seatIndex) => 
                  <Seat key={seatIndex} seat={seat} rowIndex={rowIndex} seatIndex={seatIndex} />
                )}</div>
              )}
            </div>        

            <div className={styles.hall_legend}>
              <div className={styles.hall_seat_legend}>
                <div className={styles.hall_seat}></div><div className={styles.hall_seat_title}>Свободно ({selectedHall?.hall_price_standart} руб)</div>
              </div>
              <div className={styles.hall_seat_legend}>
                <div className={styles.hall_seat + ' ' + styles.hall_seat_taken}></div><div className={styles.hall_seat_title}>Занято</div>
              </div>              
              <div className={styles.hall_seat_legend}>
                <div className={styles.hall_seat + ' ' + styles.hall_seat_vip}></div><div className={styles.hall_seat_title}>Свободно VIP ({selectedHall?.hall_price_vip} руб)</div>
              </div>              
              <div className={styles.hall_seat_legend}>
                <div className={styles.hall_seat + ' ' + styles.hall_seat_selected}></div><div className={styles.hall_seat_title}>Выбрано</div>
              </div>              
            </div>        
          </div>
        </div>

        <div className={styles.hall_booking}>
          <div className={styles.hall_booking__button}>ЗАБРОНИРОВАТЬ</div>
        </div>
      </div>
  )
}