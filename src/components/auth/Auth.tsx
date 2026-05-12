// import styles from './Auth.module.css'
import type { FormEvent } from 'react'
import stylesAdminForm from  '../../css/FormAdmin.module.css'

export default function Auth() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
      <div className={stylesAdminForm.admin_form_inner}>
        
        <div className={stylesAdminForm.admin_form_container}>
          <div className={stylesAdminForm.admin_form_header}>АВТОРИЗАЦИЯ</div>
          
          <form className={stylesAdminForm.admin_form} onSubmit={onSubmit}>
            <div  className={stylesAdminForm.admin_form_fields}>
              <div>
                <div className={stylesAdminForm.admin_form_description}>E-mail</div>
                <input type='email' placeholder='email@mail.com' name='email' className={stylesAdminForm.admin_form_input}/>
              </div>
              <div>
                <div className={stylesAdminForm.admin_form_description}>Пароль</div>
                <input type='password' name='password' className={stylesAdminForm.admin_form_input}/>
              </div>

            </div>

            <div className={stylesAdminForm.admin_form_buttons}>
              <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>АВТОРИЗОВАТЬСЯ</button>
            </div>
          </form>            
        </div>
      
      </div>
  )
}