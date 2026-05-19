import type { FilmType, SeanceType, HallType, SeanceWithHallType, ClientPageType } from '../../types/types'
import styles from './Film.module.css'

interface FilmProps {
  film: FilmType
  seances: SeanceType[]
  halls: HallType[]
  setClientPage: (page: ClientPageType) => void
  setSelectedSeance: (seance: SeanceWithHallType) => void
  setSelectedFilm: (film: FilmType) => void
  setSelectedHall: (hall: HallType | null) => void
  selectedDate: Date
}

interface HallProps {
  seances: SeanceWithHallType[]
}

function isSeanceActive(seance: SeanceType, selectedDate: Date) {
  const timeSeance = seance.seance_time.split(':')
  const seanseDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), +timeSeance[0], +timeSeance[1])
  return seanseDate > (new Date())
}

export default function Film({film, seances, halls, setClientPage, setSelectedSeance, setSelectedFilm, setSelectedHall, selectedDate}: FilmProps) {
  const groupSeancesOfHalls: Record<number, SeanceWithHallType[]> = {}
  for (const seance of seances) {
    if (!groupSeancesOfHalls[seance.seance_hallid]) groupSeancesOfHalls[seance.seance_hallid] = []
    groupSeancesOfHalls[seance.seance_hallid].push({...seance, seance_hallname: halls.find(hall => hall.id === seance.seance_hallid)?.hall_name})
  }

  function onClickSeance(seance: SeanceWithHallType) {
    setClientPage('ticketsSelect')
    setSelectedSeance(seance)
    setSelectedFilm(film)
    
    const hallFind = halls.find(hall => hall.id === seance.seance_hallid)
    setSelectedHall(hallFind ? hallFind : null)
  }

  function Hall({seances}: HallProps) {
    return (
      <div>
        <div className={styles.film_hallname}>{seances[0].seance_hallname ? seances[0].seance_hallname.charAt(0).toUpperCase() + seances[0].seance_hallname.slice(1) : '-'}</div>
        <div className={styles.film_seances}>
          {seances.sort((a, b) => a.seance_time.localeCompare(b.seance_time)).map((seance, index) => <div onClick={() => onClickSeance(seance)} key={index} className={isSeanceActive(seance, selectedDate) ? styles.film_seance : styles.film_seance + ' ' + styles.film_seance_not_active}>{seance.seance_time}</div>)}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.film}>
      <div className={styles.film_poster_and_description}>
        <img src={film.film_poster} className={styles.film_poster}/>
        <div className={styles.film_description_container}>
          <div className={styles.film_name}>{film.film_name}</div>
          <div className={styles.film_description}>{film.film_description}</div>
          <div className={styles.film_duration}>{film.film_duration} минут {film.film_origin}</div>
          <div className={styles.film_rectangle}></div>
        </div>
      </div>

      <div className={styles.film_hallname_seances}>
        {Object.values(groupSeancesOfHalls).map((seances, index) => <Hall key={index} seances={seances} />)}
      </div>
    </div>
  )
}