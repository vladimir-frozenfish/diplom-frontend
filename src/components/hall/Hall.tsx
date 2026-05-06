import type { FilmType, HallType, SeanceWithHallType } from '../../types/types.ts'
import { basePath } from '../../enum/enum.ts'
import styles from './Hall.module.css'

interface HallProps {
  selectedDate: Date
  selectedSeance: SeanceWithHallType | null
  selectedFilm: FilmType | null
  selectedHall: HallType | null

}

export default function Hall({selectedDate, selectedSeance, selectedFilm, selectedHall}: HallProps) {
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
            <img className={styles.hall_schema__screen} src={basePath + '/hall_screen.png'} />
          </div>
        </div>        

        <div className={styles.hall_booking}>
          <div className={styles.hall_booking__button}>ЗАБРОНИРОВАТЬ</div>
        </div>
      </div>
  )
}