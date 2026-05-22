import { useState } from 'react'
import type { FormEvent, Dispatch, SetStateAction } from 'react'
import type { HallType, SeatType } from '../../types/types.ts'
import { getResponseFromForm } from '../../utils/response.ts'
import LoadingModal from '../../utils/loadingModal/LoadingModal.tsx'
import Button from '../../utils/button/Button.tsx'
import styles from './HallСonfiguration.module.css'
import stylesAdminForm from  '../../css/FormAdmin.module.css'

interface HallСonfigurationProps {
  halls: HallType[] | undefined
  setIsUpdateData: Dispatch<SetStateAction<boolean>>
}

interface SeatProps {
  seat: SeatType
  rowIndex: number
  seatIndex: number
}

export default function HallСonfiguration({halls, setIsUpdateData}: HallСonfigurationProps) {
  const [isConfirmHall, setIsConfirmHall] = useState(false)
  const [currentHall, setCurrentHall] = useState<HallType | null>(null)
  const [rowsHall, setRowsHall] = useState(0)
  const [placesHall, setPlacesHall] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isСonfigurationHalllError, setIsСonfigurationHallError] = useState(false)

  function onClickHall(hall: HallType) {
    setCurrentHall(hall)
    setRowsHall(hall.hall_rows)
    setPlacesHall(hall.hall_places)
  }

  function onClickSeat({seat, rowIndex, seatIndex}: SeatProps) {
    let nextSeat: SeatType = 'standart'
    switch (seat) {
      case 'standart':
        nextSeat = 'vip'
        break
      case 'vip':
        nextSeat = 'disabled'
        break
      case 'disabled':
        nextSeat = 'standart'
        break
    }

    setCurrentHall((prevHall) => {
      if (!prevHall) {return null}
      else {
        const tempHallConfig = prevHall.hall_config
        tempHallConfig[rowIndex][seatIndex] = nextSeat
        return {
          ...prevHall, 
          hall_config: tempHallConfig
        }
      }
    })
  }

  function Seat({seat, rowIndex, seatIndex}: SeatProps) {
    let seatStyle = styles.hall_configuration_seat
    if (seat == 'vip') seatStyle += ' ' + styles.hall_configuration_seat_vip
    if (seat == 'disabled') seatStyle += ' ' + styles.hall_configuration_seat_disabled
    
    return (
      <div className={seatStyle} onClick={() => onClickSeat({seat, rowIndex, seatIndex})}></div>
    )
  }

  function onChangeRows(e: React.ChangeEvent<HTMLInputElement>) {
    const currentRows = +e.currentTarget.value > 0 ? +e.currentTarget.value : 1
    // уменьшаем или увеличиваем колиество рядов в зале
    if (currentRows < rowsHall) {
      setCurrentHall((prevHall) => {
        if (!prevHall) return null
        else {return {...prevHall, hall_config: prevHall.hall_config.slice(0, currentRows)}}
      })
    }
    if (currentRows > rowsHall) {
      setCurrentHall((prevHall) => {
        if (!prevHall) return null
        else {
          const addRow = Array(placesHall).fill('standart')
          const addRows = Array(currentRows - rowsHall).fill(addRow)
          return {...prevHall, hall_config: [...prevHall.hall_config, ...addRows]}
        }
      })
    }
    setRowsHall(currentRows)
  }

  function onChangePlaces(e: React.ChangeEvent<HTMLInputElement>) {
    const currentPlaces = +e.currentTarget.value > 0 ? +e.currentTarget.value : 1
    // уменьшаем или увеличиваем колиество мест в каждом ряду в зале
    if (currentPlaces < placesHall) {
      setCurrentHall((prevHall) => {
        if (!prevHall) return null
        else {
          const rows = []
          for (const row of prevHall.hall_config) {
            rows.push(row.slice(0, currentPlaces))
          }
          return {...prevHall, hall_config: rows}
        }
      })    
    }
    if (currentPlaces > placesHall) {
      setCurrentHall((prevHall) => {
        if (!prevHall) return null
        else {
          const addPlaces = Array(currentPlaces - placesHall).fill('standart')
          const rows = []
          for (const row of prevHall.hall_config) {
            rows.push([...row, ...addPlaces])
          }
          return {...prevHall, hall_config: rows}
        }
      })
    }
    
    setPlacesHall(currentPlaces)
  }

  async function onConfirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const form = new FormData()
    form.set('rowCount', String(rowsHall))
    form.set('placeCount', String(placesHall))
    form.set('config', JSON.stringify(currentHall?.hall_config))

    try {
      const response = await getResponseFromForm(`/hall/${currentHall?.id}`, 'POST', form)
      const data = await response.json()

      if (data.success) {
        setIsConfirmHall(false)
        setIsUpdateData((current) => !current)
      } else {
        setIsСonfigurationHallError(true)
      }
      
    } catch(e) {
      console.error(e)
    }
    
    setIsLoading(false)
  }

  function onResetConfirm() {
    setIsConfirmHall(false)
    setIsСonfigurationHallError(false)
  }

  return (
      <div>
        <div>Выберите зал для конфигурации:</div>
        <div className={styles.hall_configuration_nav}>
          {halls && halls.length > 0 ? (
            halls.map((hall, index) => (
              <div 
                className={currentHall?.id === hall.id ? styles.hall_configuration_nav_button + ' ' + styles.hall_configuration_nav_button_current : styles.hall_configuration_nav_button} 
                key={index} 
                onClick={() => onClickHall(hall)}
              >
                {hall.hall_name}
              </div>
            ))
          ) : (<div>Залов не найдено</div>)}
        </div>

        <div className={styles.hall_configuration_container}>
          <div>Укажите количество рядов и максимальное количество кресел в ряду:</div>
          <div className={styles.hall_configuration_rows_inputs}>
            <div className={styles.hall_configuration_rows_input_filed}>
              <div className={styles.hall_configuration_rows_input_title}>Рядов, шт</div>
              <input className={styles.hall_configuration_rows_input} type='number' min={1} value={rowsHall} onChange={onChangeRows} onKeyDown={(e) => e.preventDefault()}></input>
            </div>
            <div>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.74512 8.82422H6.71484L4.33301 5.45801L1.97754 8.82422H0L3.41895 4.39453L0.158203 0H2.11816L4.43848 3.39258L6.71484 0H8.60449L5.29102 4.42969L8.74512 8.82422Z" fill="#848484"/>
              </svg>
            </div>
            <div className={styles.hall_configuration_rows_input_filed}>
              <div className={styles.hall_configuration_rows_input_title}>Мест, шт</div>
              <input className={styles.hall_configuration_rows_input} type='number' min={1} value={placesHall} onChange={onChangePlaces} onKeyDown={(e) => e.preventDefault()}></input>
            </div>            
          </div>
        </div>

        <div className={styles.hall_configuration_container}>
          <div>Теперь вы можете указать типы кресел на схеме зала:</div>
          <div className={styles.hall_configuration_seats_legend}>
            <div className={styles.hall_configuration_seat_legend}>
              <div className={styles.hall_configuration_seat}></div>
              <span>&mdash;</span>
              <span>обычные кресла</span>
            </div>

            <div className={styles.hall_configuration_seat_legend}>
              <div className={styles.hall_configuration_seat + ' ' + styles.hall_configuration_seat_vip}></div>
              <span>&mdash;</span>
              <span>VIP кресла</span>
            </div>

            <div className={styles.hall_configuration_seat_legend}>
              <div className={styles.hall_configuration_seat + ' ' + styles.hall_configuration_seat_disabled}></div>
              <span>&mdash;</span>
              <span>заблокированные (нет кресла)</span>
            </div>
          </div>

          <div className={styles.hall_configuration_seat_schema_container}>
            <div className={styles.hall_configuration_seat_schema_screen}>ЭКРАН</div>
            
            {currentHall 
              ? 
              <div className={styles.hall_configuration_seat_schema_seats}>
                {currentHall.hall_config.map((hallrow, rowIndex) => 
                  <div key={rowIndex} className={styles.hall_configuration_seat_schema_seats_row}>{hallrow.map((seat, seatIndex) => 
                    <Seat key={seatIndex} seat={seat} rowIndex={rowIndex} seatIndex={seatIndex} />
                  )}</div>
                )}
              </div>                  
              :
              <div>Выберите зал.</div>
            }

          </div>
        </div>

        <div className={styles.hall_configuration_buttons}>
          <Button text='ОТМЕНА' isCancel={true} onClick={() => {if (currentHall) setIsUpdateData((current) => !current)}} />
          <Button text='СОХРАНИТЬ' onClick={() => {if (currentHall) setIsConfirmHall(true)}} />
        </div>

        {isConfirmHall && 
          <div className={stylesAdminForm.admin_form_modal}>
            <div className={stylesAdminForm.admin_form_container}>
              <div className={stylesAdminForm.admin_form_header}>КОНФИГУРАЦИЯ ЗАЛА</div>
              <form className={stylesAdminForm.admin_form} onSubmit={onConfirm} onReset={onResetConfirm}>
                <div className={stylesAdminForm.admin_form_caption}>Сохранить конфигурацию зала - <span>{currentHall?.hall_name}?</span></div>

                <div className={stylesAdminForm.admin_form_buttons}>
                  <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>СОХРАНИТЬ</button>
                  <button type="reset" className={stylesAdminForm.admin_form_button}>ОТМЕНИТЬ</button>
                </div>

                {isСonfigurationHalllError && <div className={stylesAdminForm.admin_form_error}>Не удалось сохранить зал.</div>}
              </form>
            </div>
          </div>
        }            

        {isLoading && <LoadingModal />}
      </div>
  )
}