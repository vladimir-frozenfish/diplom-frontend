import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { HallType } from '../../types/types.ts'
// import { basePath } from '../../enum/enum.ts'
// import { getResponseFromForm, getResponse } from '../../utils/response.ts'
import LoadingModal from '../../utils/loadingModal/LoadingModal.tsx'
// import Button from '../../utils/button/Button.tsx'
import styles from './HallСonfiguration.module.css'
// import stylesAdminForm from  '../../css/FormAdmin.module.css'

interface HallHallСonfigurationProps {
  halls: HallType[] | undefined
  setIsUpdateData: Dispatch<SetStateAction<boolean>>
}

export default function HallСonfiguration({halls, setIsUpdateData}: HallHallСonfigurationProps) {
  // const [isAddHall, setIsAddHall] = useState(false)
  // const [deleteHall, setDeleteAddHall] = useState<HallType | null>(null)
  const [currentHall, setCurrentHall] = useState<HallType | null>(null)
  const [rowsHall, setRowsHall] = useState(0)
  const [placesHall, setPlacesHall] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  // const [isAddHallError, setIsAddHallError] = useState(false)
  // const [isDeleteHalllError, setIsDeleteHallError] = useState(false)

  // async function onSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault()

  //   setIsLoading(true)
    
  //   const form = new FormData(e.currentTarget)

  //   try {
  //     const response = await getResponseFromForm('/hall', 'POST', form)
  //     const data = await response.json()

  //     if (data.success) {
  //       setIsAddHall(false)
  //       setIsUpdateData((current) => !current)
  //     } else {
  //       setIsAddHallError(true)
  //     }
      
  //   } catch(e) {
  //     console.error(e)
  //   }
    
  //   setIsLoading(false)
  // }

  // function onReset() {
  //   setIsAddHall(false)
  //   setIsAddHallError(false)
  // }

  function onClickHall(hall: HallType) {
    setCurrentHall(hall)
    setRowsHall(hall.hall_rows)
    setPlacesHall(hall.hall_places)
    // console.log(hall)
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

        <div className={styles.hall_configuration_rows_container}>
          <div>Укажите количество рядов и максимальное количество кресел в ряду:</div>
          <div className={styles.hall_configuration_rows_container_inputs}>
            <div className={styles.hall_configuration_rows_container_input_filed}>
              <div className={styles.hall_configuration_rows_container_input_title}>Рядов, шт</div>
              <input className={styles.hall_configuration_rows_container_input} type='number' value={rowsHall} onChange={(e) => setRowsHall(+e.currentTarget.value)}></input>
            </div>
            <div>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.74512 8.82422H6.71484L4.33301 5.45801L1.97754 8.82422H0L3.41895 4.39453L0.158203 0H2.11816L4.43848 3.39258L6.71484 0H8.60449L5.29102 4.42969L8.74512 8.82422Z" fill="#848484"/>
              </svg>
            </div>
            <div className={styles.hall_configuration_rows_container_input_filed}>
              <div className={styles.hall_configuration_rows_container_input_title}>Мест, шт</div>
              <input className={styles.hall_configuration_rows_container_input} type='number' value={placesHall} onChange={(e) => setPlacesHall(+e.currentTarget.value)}></input>
            </div>            
          </div>
        </div>

        {/* <div className={styles.hall_management_buttons}>
          <Button text='СОЗДАТЬ ЗАЛ' onClick={() => {setIsAddHall(true)}} />
        </div> */}

        {isLoading && <LoadingModal />}
      </div>
  )
}