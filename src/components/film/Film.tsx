import type { FilmType, SeanceType, HallType } from '../../types/types'
import styles from './Film.module.css'

interface FilmProps {
  film: FilmType
  seances: SeanceType[]
  halls: HallType[]
}

interface SeanceWithHallType extends SeanceType {
  seance_hallname: string | undefined
}

export default function Film({film, seances, halls}: FilmProps) {
  let groupSeancesOfHalls: Record<number, SeanceWithHallType[]> = {}
  for (let seance of seances) {
    if (!groupSeancesOfHalls[seance.seance_hallid]) groupSeancesOfHalls[seance.seance_hallid] = []
    groupSeancesOfHalls[seance.seance_hallid].push({...seance, seance_hallname: halls.find(hall => hall.id === seance.seance_hallid)?.hall_name})
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

      {Object.values(groupSeancesOfHalls).map((item, index) => <div key={index}>{item[0].seance_hallname}</div>)}
    </div>
  )
}