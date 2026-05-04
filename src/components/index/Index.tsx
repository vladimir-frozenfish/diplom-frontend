import { useState, useEffect } from 'react'
import { getResponse } from '../../utils/response'
import type { AllDataType } from '../../types/types.ts'
// import styles from './Index.module.css'

export default function Index() {
  const [allData, setAllData] = useState<AllDataType | null>(null)
  const [isErrorResponse, setIsErrorResponse] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
      {isErrorResponse ? <div>Ошибка получения данных.</div> :
        isLoading ? <div>Загрузка...</div> : <div>{allData ? Object.values(allData.result.films).length : 'Не найдено'}</div>
      }
    </>
  )
}