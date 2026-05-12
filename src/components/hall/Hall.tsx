import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { FilmType, HallType, SeanceWithHallType, DateHallConfig, SeatType, ClientPageType, TicketsType, TicketBookingType } from '../../types/types.ts'
import { getResponse } from '../../utils/response.ts'
import { basePath } from '../../enum/enum.ts'
import styles from './Hall.module.css'

interface HallProps {
  selectedDate: Date
  selectedSeance: SeanceWithHallType | null
  selectedFilm: FilmType | null
  selectedHall: HallType | null
  setClientPage: (page: ClientPageType) => void
  tickets: TicketsType
  setTickets: Dispatch<SetStateAction<TicketsType>>
  setTicketsBooking: Dispatch<SetStateAction<TicketBookingType[] | null>>
}

interface SeatProps {
  seat: SeatType
  rowIndex: number
  seatIndex: number
}

function isTicketSelected(tickets: TicketsType, rowIndex: number, seatIndex: number) {
  return tickets.some(ticket => ticket[0] === rowIndex && ticket[1] === seatIndex)
}

export default function Hall({selectedDate, selectedSeance, selectedFilm, selectedHall, setClientPage, tickets, setTickets, setTicketsBooking}: HallProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isErrorResponse, setIsErrorResponse] = useState(false)
  const [hallConfig, setHallConfig] = useState<DateHallConfig | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const response = await getResponse(`/hallconfig?seanceId=${selectedSeance?.id}&date=${selectedDate.toISOString().split('T')[0]}`)
        setHallConfig(await response.json())
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        setIsErrorResponse(true)
      }
    })()
  }, [selectedDate, selectedSeance])
  
  if (isErrorResponse) {
    return (<div>Ошибка получения данных.</div>)
  }

  if (isLoading) {
    return (<div>Загрузка...</div>)
  }  

  function onClickSeat({seat, rowIndex, seatIndex}: SeatProps) {
    if (seat === 'taken' || seat === 'disabled') {
      return
    }

    let seatPrice = seat == 'standart' ? selectedHall?.hall_price_standart : selectedHall?.hall_price_vip
    if (!seatPrice) seatPrice = 0

    setTickets(prevTickets => {
      if (isTicketSelected(prevTickets, rowIndex, seatIndex)) {
        return prevTickets.filter(ticket => !(ticket[0] === rowIndex && ticket[1] === seatIndex))
      } else {
        return [...prevTickets, [rowIndex, seatIndex, seatPrice]]
      }
    })
  }

  async function onClickBooking() {
    if (tickets.length && selectedSeance?.id && selectedDate) {
      
      const ticketsForBody = []
      for (const ticket of tickets) {
        ticketsForBody.push({row: ticket[0] + 1, place: ticket[1] + 1, coast: ticket[2]})
      }

      const form = new URLSearchParams()
      form.append('seanceId', selectedSeance.id.toString())
      form.append('ticketDate', selectedDate.toISOString().split('T')[0])
      form.append('tickets', JSON.stringify(ticketsForBody))

      try {
        const response = await getResponse('/ticket', 'POST', 'application/x-www-form-urlencoded', form)
        const data = await response.json()

        if (data.success) {
          setTicketsBooking(data.result)
          setClientPage('ticketsBooking')
        }
      } catch(e) {
        console.error(e)
      }
    }
  }

  function Seat({seat, rowIndex, seatIndex}: SeatProps) {
    let seatStyle = styles.hall_seat
    if (seat == 'vip') seatStyle += ' ' + styles.hall_seat_vip
    if (seat == 'disabled') seatStyle += ' ' + styles.hall_seat_disabled
    if (seat == 'taken') seatStyle += ' ' + styles.hall_seat_taken
    if (isTicketSelected(tickets, rowIndex, seatIndex)) seatStyle += ' ' + styles.hall_seat_selected
    
    return (
      <div className={seatStyle} onClick={() => onClickSeat({seat, rowIndex, seatIndex})}></div>
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
          <div className={styles.hall_booking__button} onClick={onClickBooking}>ЗАБРОНИРОВАТЬ</div>
        </div>
      </div>
  )
}