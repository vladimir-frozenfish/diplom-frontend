import { useState, useEffect } from 'react'
import { getResponse } from '../../utils/response'
import type { AllDataType, SeanceWithHallType, FilmType, HallType, ClientPageType, TicketsType, TicketBookingType } from '../../types/types.ts'
import Calendar from '../calendar/Calendar.tsx'
import Film from '../film/Film.tsx'
import styles from './Index.module.css'
import Hall from '../hall/Hall.tsx'
import Booking from '../booking/Booking.tsx'

export default function Index() {
  const [allData, setAllData] = useState<AllDataType | null>(null)
  const [isErrorResponse, setIsErrorResponse] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSeance, setSelectedSeance] = useState<SeanceWithHallType | null>(null)
  const [selectedFilm, setSelectedFilm] = useState<FilmType | null>(null)
  const [selectedHall, setSelectedHall] = useState<HallType | null>(null)
  const [tickets, setTickets] = useState<TicketsType>([])
  const [clientPage, setClientPage] = useState<ClientPageType>('films')
  const [ticketsBooking, setTicketsBooking] = useState<TicketBookingType[] | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const response = await getResponse('/alldata')
        setAllData(await response.json())
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

  if (clientPage == 'ticketsBooking') {
    return (
      <Booking 
        selectedDate={selectedDate} 
        selectedSeance={selectedSeance} 
        selectedFilm={selectedFilm}
        selectedHall={selectedHall}
        ticketsBooking={ticketsBooking}
      />
    )
  }

  if (clientPage == 'ticketsSelect') {
    return (
      <Hall 
        selectedDate={selectedDate} 
        selectedSeance={selectedSeance} 
        selectedFilm={selectedFilm}
        selectedHall={selectedHall}
        setClientPage={(page: ClientPageType) => setClientPage(page)}
        tickets={tickets}
        setTickets={setTickets}
        setTicketsBooking={setTicketsBooking}
      />
    )
  }

  return (
    <>
      <Calendar 
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
      />
      
      <div className={styles.index_films}>
        {allData?.result.films.map(
          (film, index) => 
          <Film 
            key={index} 
            film={film} 
            seances={allData.result.seances.filter(value => value.seance_filmid === film.id)}
            halls={allData.result.halls}
            setClientPage={(page: ClientPageType) => setClientPage(page)}
            setSelectedSeance={(seance: SeanceWithHallType) => setSelectedSeance(seance)}
            setSelectedFilm={(film: FilmType) => setSelectedFilm(film)}
            setSelectedHall={(hall: HallType | null) => setSelectedHall(hall)}
          />
        )}
      </div>
    </>
  )
}