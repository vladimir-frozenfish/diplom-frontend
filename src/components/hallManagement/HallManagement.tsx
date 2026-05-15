import { useState } from 'react'
import type { FormEvent, Dispatch, SetStateAction } from 'react'
import type { HallType } from '../../types/types.ts'
import { basePath } from '../../enum/enum.ts'
import { getResponseFromForm, getResponse } from '../../utils/response.ts'
import LoadingModal from '../../utils/loadingModal/LoadingModal.tsx'
import Button from '../../utils/button/Button.tsx'
import styles from './HallManagement.module.css'
import stylesAdminForm from  '../../css/FormAdmin.module.css'

interface HallManagementProps {
  halls: HallType[] | undefined
  setIsUpdateData: Dispatch<SetStateAction<boolean>>
}

export default function HallManagement({halls, setIsUpdateData}: HallManagementProps) {
  const [isAddHall, setIsAddHall] = useState(false)
  const [deleteHall, setDeleteAddHall] = useState<HallType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddHallError, setIsAddHallError] = useState(false)
  const [isDeleteHalllError, setIsDeleteHallError] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsLoading(true)
    
    const form = new FormData(e.currentTarget)

    try {
      const response = await getResponseFromForm('/hall', 'POST', form)
      const data = await response.json()

      if (data.success) {
        setIsAddHall(false)
        setIsUpdateData((current) => !current)
      } else {
        setIsAddHallError(true)
      }
      
    } catch(e) {
      console.error(e)
    }
    
    setIsLoading(false)
  }

  async function onSubmitDelete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await getResponse(`/hall/${deleteHall?.id}`, 'DELETE')
      const data = await response.json()

      if (data.success) {
        setDeleteAddHall(null)
        setIsUpdateData((current) => !current)
      } else {
        setIsDeleteHallError(true)
      }
      
    } catch(e) {
      console.error(e)
    }
    
    setIsLoading(false)
  }

  function onResetDelete() {
    setDeleteAddHall(null)
    setIsDeleteHallError(false)
  }

  function onReset() {
    setIsAddHall(false)
    setIsAddHallError(false)
  }

  return (
      <div>
        <div>Доступные залы:</div>
        <ul className={styles.hall_management_halls}>
          {halls && halls.length > 0 ? (
            halls.map((hall, index) => (
              <li key={index}>
                <div>{hall.hall_name}</div>
                <div className={styles.hall_management_delete} onClick={() => setDeleteAddHall(hall)}>
                  <img src={basePath + '/delete.svg'} alt="Удалить" />
                </div>
              </li>
            ))
          ) : (<li>Залов не найдено</li>)}
        </ul>
        <div className={styles.hall_management_buttons}>
          <Button text='СОЗДАТЬ ЗАЛ' onClick={() => {setIsAddHall(true)}} />
        </div>
        
        {isAddHall && 
          <div className={stylesAdminForm.admin_form_modal}>
            <div className={stylesAdminForm.admin_form_container}>
              <div className={stylesAdminForm.admin_form_header}>ДОБАВЛЕНИЕ ЗАЛА</div>
              <form className={stylesAdminForm.admin_form} onSubmit={onSubmit} onReset={onReset}>
                <div  className={stylesAdminForm.admin_form_fields}>
                  <div className={stylesAdminForm.admin_form_description}>Название зала</div>
                  <input placeholder='Зал 1' name='hallName' className={stylesAdminForm.admin_form_input + ' ' + styles.hall_management_add_hall_input} required/>
                </div>

                <div className={stylesAdminForm.admin_form_buttons}>
                  <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>ДОБАВИТЬ ЗАЛ</button>
                  <button type="reset" className={stylesAdminForm.admin_form_button}>ОТМЕНИТЬ</button>
                </div>

                {isAddHallError && <div className={stylesAdminForm.admin_form_error}>Не удалось добавить зал.</div>}
              </form>
            </div>
          </div>
        }

        {deleteHall && 
          <div className={stylesAdminForm.admin_form_modal}>
            <div className={stylesAdminForm.admin_form_container}>
              <div className={stylesAdminForm.admin_form_header}>УДАЛЕНИЕ ЗАЛА</div>
              <form className={stylesAdminForm.admin_form} onSubmit={onSubmitDelete} onReset={onResetDelete}>
                <div className={stylesAdminForm.admin_form_caption}>Вы хотите удалить зал - <span>{deleteHall.hall_name}?</span></div>

                <div className={stylesAdminForm.admin_form_buttons}>
                  <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>УДАЛИТЬ ЗАЛ</button>
                  <button type="reset" className={stylesAdminForm.admin_form_button}>ОТМЕНИТЬ</button>
                </div>

                {isDeleteHalllError && <div className={stylesAdminForm.admin_form_error}>Не удалось удалить зал.</div>}
              </form>
            </div>
          </div>
        }

        {isLoading && <LoadingModal />}
      </div>
  )
}