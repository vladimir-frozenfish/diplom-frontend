import styles from './Calendar.module.css'

interface CalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

interface DayProps {
  date: Date
}

const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function areDatesEqual(dateOne: Date, dateTwo: Date): boolean {
  return (
    dateOne.getFullYear() === dateTwo.getFullYear() &&
    dateOne.getMonth() === dateTwo.getMonth() &&
    dateOne.getDate() === dateTwo.getDate()
  )
}

export default function Calendar({selectedDate, onSelectDate}: CalendarProps) {
  const currentDate = new Date()
  const dates: Date[] = []

  for (let i = 0; i <= 5; i++) {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() + i)
    dates.push(date)
  }

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
        <div className={styles.calendar_day}>{'>'}</div>
      </div>
  )
}