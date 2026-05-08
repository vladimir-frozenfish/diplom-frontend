import type { FilmType, HallType, SeanceWithHallType, TicketsType, TicketBookingType } from '../../types/types.ts'
import styles from './Booking.module.css'

interface BookingProps {
  selectedDate: Date
  selectedSeance: SeanceWithHallType | null
  selectedFilm: FilmType | null
  selectedHall: HallType | null
  tickets: TicketsType
  ticketsBooking: TicketBookingType[] | null
}


export default function Booking({selectedDate, selectedSeance, selectedFilm, selectedHall, tickets, ticketsBooking}: BookingProps) {
  console.log(ticketsBooking)
  
  function ticketPrice() {
    return  tickets.reduce((total, ticket) => {return total + ticket[2]}, 0)
  }

  return (
      <div>
        <div className={styles.booking_ticket_img}></div>
        <div className={styles.booking_greating}>ВЫ ВЫБРАЛИ БИЛЕТЫ</div>
        <div className={styles.booking_ticket_img + ' ' + styles.booking_ticket_img_scale}></div>
        <div className={styles.booking_ticket_img}></div>

        <div className={styles.booking}>
          <div className={styles.booking_info}>
            <div>На фильм: <span>{selectedFilm?.film_name}</span></div>
            <div>Места: {tickets.map((ticket, index) => <span key={index}>Ряд - {ticket[0] + 1} место - {ticket[1] + 1}; </span>)}</div>
            <div>В зале: <span>{selectedHall?.hall_name ? selectedHall?.hall_name.charAt(0).toUpperCase() + selectedHall?.hall_name.slice(1) : '-'}</span></div>
            <div>Дата: <span>{selectedDate.toLocaleDateString('ru-Ru')}</span></div>
            <div>Начало сеанса: <span>{selectedSeance?.seance_time}</span></div>
            <div>Стоимость: <span>{ticketPrice()}</span></div>
          </div>
          
          <div className={styles.booking_button}>ПОЛУЧИТЬ КОД БРОНИРОВАНИЯ</div>
          
          <div className={styles.booking_footer_info}>
            <div>После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</div>
            <div>Приятного просмотра!</div>          
          </div>
        </div>

        <div className={styles.booking_ticket_img + ' ' + styles.booking_ticket_img_scale}></div>
      </div>
  )
}