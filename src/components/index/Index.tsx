import { useState, useEffect } from 'react'
import { getResponse } from '../../utils/response'
import type { AllDataType } from '../../types/types.ts'
import Calendar from '../calendar/Calendar.tsx'
// import styles from './Index.module.css'

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

  return (
    <>
      <Calendar 
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
      />
      
      {isErrorResponse ? <div>Ошибка получения данных.</div> :
        isLoading ? <div>Загрузка...</div> : <div>{allData ? Object.values(allData.result.films).length : 'Не найдено'}</div>
      }
    </>
  )
}