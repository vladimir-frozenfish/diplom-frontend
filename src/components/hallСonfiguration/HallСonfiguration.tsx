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
  const [isLoading, setIsLoading] = useState(false)
  const [isAddHallError, setIsAddHallError] = useState(false)
  const [isDeleteHalllError, setIsDeleteHallError] = useState(false)

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

  return (
      <div>
        <div>Выберите зал для конфигурации:</div>
        <div className={styles.hall_configuration_nav}>
          {halls && halls.length > 0 ? (
            halls.map((hall, index) => (
              <div 
                className={currentHall?.id === hall.id ? styles.hall_configuration_nav_button + ' ' + styles.hall_configuration_nav_button_current : styles.hall_configuration_nav_button} 
                key={index} 
                onClick={() => setCurrentHall(hall)}
              >
                {hall.hall_name}
              </div>
            ))
          ) : (<div>Залов не найдено</div>)}
        </div>
        
        {/* <div className={styles.hall_management_buttons}>
          <Button text='СОЗДАТЬ ЗАЛ' onClick={() => {setIsAddHall(true)}} />
        </div> */}

        {isLoading && <LoadingModal />}
      </div>
  )
}