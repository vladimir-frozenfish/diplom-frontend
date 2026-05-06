import type { SeanceWithHallType } from '../../types/types.ts'
// import styles from './Hall.module.css'

interface HallProps {
  selectedDate: Date
  selectedSeance: SeanceWithHallType | null
}

export default function Hall({selectedDate, selectedSeance}: HallProps) {
  console.log(selectedDate)
  console.log(selectedSeance)
  
  return (
      <div>
        Кинозал
      </div>
  )
}