import type { FilmType, SeanceType, HallType, SeanceWithHallType } from '../../types/types'
import styles from './Film.module.css'

interface FilmProps {
  film: FilmType
  seances: SeanceType[]
  halls: HallType[]
  setIsTicketSelection: (is: boolean) => void
  setSelectedSeance: (seance: SeanceWithHallType) => void
}

// interface SeanceWithHallType extends SeanceType {
//   seance_hallname: string | undefined
// }

interface HallProps {
  seances: SeanceWithHallType[]
}

export default function Film({film, seances, halls, setIsTicketSelection, setSelectedSeance}: FilmProps) {
  const groupSeancesOfHalls: Record<number, SeanceWithHallType[]> = {}
  for (const seance of seances) {
    if (!groupSeancesOfHalls[seance.seance_hallid]) groupSeancesOfHalls[seance.seance_hallid] = []
    groupSeancesOfHalls[seance.seance_hallid].push({...seance, seance_hallname: halls.find(hall => hall.id === seance.seance_hallid)?.hall_name})
  }

  function onClickSeance(seance: SeanceWithHallType) {
    setIsTicketSelection(true)
    setSelectedSeance(seance)
  }

  function Hall({seances}: HallProps) {
    return (
      <div>
        <div className={styles.film_hallname}>{seances[0].seance_hallname ? seances[0].seance_hallname.charAt(0).toUpperCase() + seances[0].seance_hallname.slice(1) : '-'}</div>
        <div className={styles.film_seances}>
          {seances.map((seance, index) => <div onClick={() => onClickSeance(seance)} key={index} className={styles.film_seance}>{seance.seance_time}</div>)}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.film}>
      <div className={styles.film_poster_and_description}>
        <img src={film.film_poster} className={styles.film_poster}/>
        <div>
          <div className={styles.film_name}>{film.film_name}</div>
          <div className={styles.film_description}>{film.film_description}</div>
          <div className={styles.film_duration}>{film.film_duration} минут {film.film_origin}</div>
        </div>
      </div>

      <div className={styles.film_hallname_seances}>
        {Object.values(groupSeancesOfHalls).map((seances, index) => <Hall key={index} seances={seances} />)}
      </div>
    </div>
  )
}