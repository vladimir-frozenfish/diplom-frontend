import { useState } from 'react'
import type { FilmType, HallType, SeanceWithHallType, TicketBookingType } from '../../types/types.ts'
import { QRCode } from 'react-qr-code'
import styles from './Booking.module.css'

interface BookingProps {
  selectedDate: Date
  selectedSeance: SeanceWithHallType | null
  selectedFilm: FilmType | null
  selectedHall: HallType | null
  ticketsBooking: TicketBookingType[] | null
}


export default function Booking({selectedDate, selectedSeance, selectedFilm, selectedHall, ticketsBooking}: BookingProps) {
  const [isShowQrCode, setIsShowQrCode] = useState(false)

  let seats = ''
  let price = 0
  if (ticketsBooking) {
    for (const ticket of ticketsBooking) {
      seats += `Ряд - ${ticket.ticket_row} место - ${ticket.ticket_place}; `
      price += ticket.ticket_price
    }    
  }
  seats = seats.trim()

  const date = selectedDate.toLocaleDateString('ru-Ru')
  const time = selectedSeance?.seance_time
  const filmName = selectedFilm?.film_name
  const hall = selectedHall?.hall_name ? selectedHall?.hall_name.charAt(0).toUpperCase() + selectedHall?.hall_name.slice(1) : '-'
  const qrCodeString = `${date}, ${time}, ${filmName}, ${hall}, ${seats}, Цена - ${price}, Билет(ы) действителен строго на свой сеанс`

  return (
      <div>
        <div className={styles.booking_ticket_img}></div>
        <div className={styles.booking_greating}>ВЫ ВЫБРАЛИ БИЛЕТЫ</div>
        <div className={styles.booking_ticket_img + ' ' + styles.booking_ticket_img_scale}></div>
        <div className={styles.booking_ticket_img}></div>

        <div className={styles.booking}>
          <div className={styles.booking_info}>
            <div>На фильм: <span>{filmName}</span></div>
            <div>Места: <span>{seats}</span></div>
            <div>В зале: <span>{hall}</span></div>
            <div>Дата: <span>{date}</span></div>
            <div>Начало сеанса: <span>{time}</span></div>
            <div>Стоимость: <span>{price}</span></div>
          </div>
          
          {!isShowQrCode 
            ?
            <>
              <div className={styles.booking_button} onClick={() => setIsShowQrCode(true)}>ПОЛУЧИТЬ КОД БРОНИРОВАНИЯ</div>
            
              <div className={styles.booking_footer_info}>
                <div>После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.</div>
                <div>Приятного просмотра!</div>          
              </div>
            </>
            :
            <>
              <div className={styles.booking_qrcode_container}>
                <QRCode value={qrCodeString} />
              </div>
              <div className={styles.booking_footer_info}>
                <div>Покажите QR-код нашему контроллеру для подтверждения бронирования.</div>
                <div>Приятного просмотра!</div>          
              </div>
            </> 
          }
          
        </div>

        <div className={styles.booking_ticket_img + ' ' + styles.booking_ticket_img_scale}></div>
      </div>
  )
}