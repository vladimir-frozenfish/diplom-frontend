import { useState, useEffect } from 'react'
import { getResponse } from '../../utils/response'
import type { AllDataType } from '../../types/types.ts'
import Calendar from '../calendar/Calendar.tsx'
import Film from '../film/Film.tsx'
import styles from './Index.module.css'

export default function Index() {
  const [allData, setAllData] = useState<AllDataType | null>(null)
  const [isErrorResponse, setIsErrorResponse] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

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
          />
        )}
      </div>
    </>
  )
}