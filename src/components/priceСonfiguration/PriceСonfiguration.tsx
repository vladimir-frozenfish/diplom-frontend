import { useState } from 'react'
import type { FormEvent, Dispatch, SetStateAction } from 'react'
import type { HallType } from '../../types/types.ts'
import { getResponseFromForm } from '../../utils/response.ts'
import { basePath } from '../../enum/enum.ts'
import LoadingModal from '../../utils/loadingModal/LoadingModal.tsx'
import Button from '../../utils/button/Button.tsx'
import styles from './PriceСonfiguration.module.css'
import stylesAdminForm from  '../../css/FormAdmin.module.css'

interface PriceСonfigurationProps {
  halls: HallType[] | undefined
  setIsUpdateData: Dispatch<SetStateAction<boolean>>
}

export default function PriceСonfiguration({halls, setIsUpdateData}: PriceСonfigurationProps) {
  const [isConfirmPrice, setIsConfirmPrice] = useState(false)
  const [currentHall, setCurrentHall] = useState<HallType | null >(halls ? halls[0] : null)
  const [priceStandart, setPriceStandart] = useState(currentHall ? currentHall.hall_price_standart : 0)
  const [priceVip, setPriceVip] = useState(currentHall ? currentHall.hall_price_vip : 0)
  const [isLoading, setIsLoading] = useState(false)
  const [isСonfigurationPriceError, setIsСonfigurationPriceError] = useState(false)

  function onClickHall(hall: HallType) {
    setCurrentHall(hall)
    setPriceStandart(hall.hall_price_standart)
    setPriceVip(hall.hall_price_vip)
  }

  async function onConfirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const form = new FormData()
    form.set('priceStandart', String(priceStandart))
    form.set('priceVip', String(priceVip))

    try {
      const response = await getResponseFromForm(`/price/${currentHall?.id}`, 'POST', form)
      const data = await response.json()

      if (data.success) {
        setIsConfirmPrice(false)
        setIsUpdateData((current) => !current)
      } else {
        setIsСonfigurationPriceError(true)
      }
      
    } catch(e) {
      console.error(e)
    }
    
    setIsLoading(false)
  }

  function onResetConfirm() {
    setIsConfirmPrice(false)
    setIsСonfigurationPriceError(false)
  }

  function onClickCancel() {
    setPriceStandart(currentHall?.hall_price_standart || 0)
    setPriceVip(currentHall?.hall_price_vip || 0)
  }   

  return (
      <div>
        <div>Выберите зал для конфигурации:</div>
        <div className={styles.price_configuration_nav}>
          {halls && halls.length > 0 ? (
            halls.map((hall, index) => (
              <div 
                className={currentHall?.id === hall.id ? styles.price_configuration_nav_button + ' ' + styles.price_configuration_nav_button_current : styles.price_configuration_nav_button} 
                key={index} 
                onClick={() => onClickHall(hall)}
              >
                {hall.hall_name}
              </div>
            ))
          ) : (<div>Залов не найдено</div>)}
        </div>

        <div className={styles.price_configuration_container}>
          <div>Установите цены для типов кресел:</div>
            <div className={styles.price_configuration_inputs}>
              <div className={styles.price_configuration_input_filed}>
                <div className={styles.price_configuration_input_title}>Цена, рублей</div>
                <input className={styles.price_configuration_input} type='number' min={1} value={priceStandart} onChange={(e) => setPriceStandart(Math.abs(+e.currentTarget.value))}></input>
              </div>
              <div className={styles.price_configuration_legend}>
                <div>за</div>
                <div className={styles.price_configuration_seat}></div> 
                <div>обычные кресла</div>
              </div>

              <div className={styles.price_configuration_input_filed}>
                <div className={styles.price_configuration_input_title}>Цена, рублей</div>
                <input className={styles.price_configuration_input + ' ' + styles.price_configuration_input_vip} type='number' min={1} value={priceVip} onChange={(e) => setPriceVip(Math.abs(+e.currentTarget.value))}></input>
              </div>
              <div className={styles.price_configuration_legend}>
                <div>за</div>
                <div className={styles.price_configuration_seat + ' ' + styles.price_configuration_seat_vip}></div>
                <div>VIP кресла</div>
              </div>
            </div>
        </div>

        <div className={styles.price_configuration_buttons}>
          <Button text='ОТМЕНА' isCancel={true} onClick={onClickCancel} />
          <Button text='СОХРАНИТЬ' onClick={() => {if (currentHall) setIsConfirmPrice(true)}} />
        </div>

        {isConfirmPrice && 
          <div className={stylesAdminForm.admin_form_modal}>
            <div className={stylesAdminForm.admin_form_container}>
              <div className={stylesAdminForm.admin_form_header}>
                <span>КОНФИГУРАЦИЯ ЦЕН</span>
                <img src={basePath + '/admin/cancel.svg'} alt="Отмена" className={stylesAdminForm.admin_form_header_cancel} onClick={onResetConfirm}/>
              </div>
              <form className={stylesAdminForm.admin_form} onSubmit={onConfirm} onReset={onResetConfirm}>
                <div className={stylesAdminForm.admin_form_caption}>Сохранить цены зала - <span>{currentHall?.hall_name}?</span></div>

                <div className={stylesAdminForm.admin_form_buttons}>
                  <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>СОХРАНИТЬ</button>
                  <button type="reset" className={stylesAdminForm.admin_form_button}>ОТМЕНИТЬ</button>
                </div>

                {isСonfigurationPriceError && <div className={stylesAdminForm.admin_form_error}>Не удалось сохранить цены зала.</div>}
              </form>
            </div>
          </div>
        }            

        {isLoading && <LoadingModal />}
      </div>
  )
}