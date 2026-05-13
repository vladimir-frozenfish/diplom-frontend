// import styles from './Auth.module.css'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { getResponseFromForm } from '../../utils/response'
import stylesAdminForm from  '../../css/FormAdmin.module.css'

interface AuthProps {
  setIsAuth: (auth: boolean) => void
}


export default function Auth({setIsAuth}: AuthProps) {
  const [isAuthError, setIsAuthError] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    try {
      const response = await getResponseFromForm('/login', 'POST', form)
      const data = await response.json()

      if (data.success && data.result == 'Авторизация пройдена успешно!') {
        setIsAuth(true)
      } else {
        setIsAuthError(true)
      }
    } catch(e) {
      console.error(e)
    }    
  }

  return (
      <div className={stylesAdminForm.admin_form_inner}>
        
        <div className={stylesAdminForm.admin_form_container}>
          <div className={stylesAdminForm.admin_form_header}>АВТОРИЗАЦИЯ</div>
          
          <form className={stylesAdminForm.admin_form} onSubmit={onSubmit}>
            <div  className={stylesAdminForm.admin_form_fields}>
              <div>
                <div className={stylesAdminForm.admin_form_description}>E-mail</div>
                <input type='email' placeholder='email@mail.com' name='login' className={stylesAdminForm.admin_form_input}/>
              </div>
              <div>
                <div className={stylesAdminForm.admin_form_description}>Пароль</div>
                <input type='password' name='password' className={stylesAdminForm.admin_form_input}/>
              </div>

            </div>

            <div className={stylesAdminForm.admin_form_buttons}>
              <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>АВТОРИЗОВАТЬСЯ</button>
            </div>

            {isAuthError && <div className={stylesAdminForm.admin_form_error}>Ошибка авторизации</div>}
          </form>

        </div>
      </div>
  )
}