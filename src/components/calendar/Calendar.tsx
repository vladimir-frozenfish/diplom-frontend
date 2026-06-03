import { useState } from 'react'
import { areDatesEqual } from '../../utils/utils'
import { basePath } from '../../enum/enum'
import styles from './Calendar.module.css'

interface CalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

interface DayProps {
  date: Date
}

const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function getDates(firstDate: Date) {
  const dates: Date[] = []

  for (let i = 0; i <= 5; i++) {
    const date = new Date(firstDate)
    date.setDate(firstDate.getDate() + i)
    dates.push(date)
  }

  return dates
}

export default function Calendar({selectedDate, onSelectDate}: CalendarProps) {
  const currentDate = new Date()
  const [ dates, setDates ] = useState<Date[]>(getDates(currentDate))
  
  function Day({date}: DayProps) {
    let stylesDay = styles.calendar_day
    if (areDatesEqual(date, selectedDate)) stylesDay += ' ' + styles.calendar_day_active
    if ([0, 6].includes(date.getDay())) stylesDay += ' ' + styles.calendar_day_weekend


    return (
      <div onClick={() => onSelectDate(date)} className={stylesDay}>
        {areDatesEqual(date, currentDate) 
          ?
            <>
              Сегодня <br/>
              {days[date.getDay()]}, {date.getDate()}
            </>
          :
            <>
              {days[date.getDay()]},<br/>{date.getDate()}
            </>
        }
      </div>
    )
  }

  return (
    <div className={styles.calendar}>
        {dates.map((date, index) => <Day key={index} date={date} />)}
        <div 
          className={styles.calendar_day + ' ' + styles.calendar_day_more} 
          onClick={() => setDates((currentDates) => getDates(currentDates[1]))}
        >
          <img src={basePath + '/chevron_right.svg'} alt="Next" />
        </div>
      </div>
  )
}