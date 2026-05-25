import { useState, useRef } from 'react'
import type { FormEvent, Dispatch, SetStateAction } from 'react'
import type { FilmType } from '../../types/types.ts'
// import { basePath } from '../../enum/enum.ts'
import { getResponseFromForm, getResponse } from '../../utils/response.ts'
import { generatePastelColor } from '../../utils/utils.ts'
import LoadingModal from '../../utils/loadingModal/LoadingModal.tsx'
import Button from '../../utils/button/Button.tsx'
import styles from './FilmManagement.module.css'
import stylesAdminForm from  '../../css/FormAdmin.module.css'

interface FilmManagementProps {
  films: FilmType[] | undefined
  setIsUpdateData: Dispatch<SetStateAction<boolean>>
}

interface FilmProps {
  film: FilmType
}

export default function FilmManagement({films, setIsUpdateData}: FilmManagementProps) {
  const [isAddFilm, setIsAddFilm] = useState(false)
  // const [deleteHall, setDeleteAddHall] = useState<HallType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddFilmError, setIsAddFilmError] = useState(false)
  // const [isDeleteHalllError, setIsDeleteHallError] = useState(false)
  const inputFileRef = useRef<HTMLInputElement>(null)

  function onPosterChange() {
    const file = inputFileRef.current?.files?.[0];
    if (file) {
      console.log('Выбран файл:', file.name);
    }
  };

  async function onSubmitAddFilm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsLoading(true)
    
    const form = new FormData(e.currentTarget)

    try {
      const response = await getResponseFromForm('/film', 'POST', form)
      const data = await response.json()

      if (data.success) {
        setIsAddFilm(false)
        setIsUpdateData((current) => !current)
      } else {
        setIsAddFilmError(true)
      }
      
    } catch(e) {
      console.error(e)
    }
    
    setIsLoading(false)
  }

  function onResetAddFilm() {
    setIsAddFilm(false)
    setIsAddFilmError(false)
  }  

  // async function onSubmitDelete(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   setIsLoading(true)
    
  //   try {
  //     const response = await getResponse(`/hall/${deleteHall?.id}`, 'DELETE')
  //     const data = await response.json()

  //     if (data.success) {
  //       setDeleteAddHall(null)
  //       setIsUpdateData((current) => !current)
  //     } else {
  //       setIsDeleteHallError(true)
  //     }
      
  //   } catch(e) {
  //     console.error(e)
  //   }
    
  //   setIsLoading(false)
  // }

  // function onResetDelete() {
  //   setDeleteAddHall(null)
  //   setIsDeleteHallError(false)
  // }

  function Film({film}: FilmProps) {
    return (
      <div className={styles.film_management_film} style={{backgroundColor: generatePastelColor()}}>
        <img src={film.film_poster} className={styles.film_management_film_poster}/>
        <div className={styles.film_management_description_container}>
          <div className={styles.film_management_name}>{film.film_name}</div>
          <div className={styles.film_management_duration}>{film.film_duration} минут</div>
        </div>
      </div>
    )
  }

  return (
      <div>
        <div className={styles.film_management_buttons}>
          <Button text='ДОБАВИТЬ ФИЛЬМ' onClick={() => {setIsAddFilm(true)}} />
        </div>

        <div className={styles.film_management_films}>
          {films && films.length > 0 ? (films?.map((film, index) => <Film key={index} film={film} />)) : (<div>Фильмов не найдено</div>)}
        </div>
        
        {isAddFilm && 
          <div className={stylesAdminForm.admin_form_modal}>
            <div className={stylesAdminForm.admin_form_container + ' ' + stylesAdminForm.admin_form_container_wide}>
              <div className={stylesAdminForm.admin_form_header}>ДОБАВЛЕНИЕ ФИЛЬМА</div>
              <form id='addFilmForm' className={stylesAdminForm.admin_form} onSubmit={onSubmitAddFilm} onReset={onResetAddFilm}>

                <div  className={stylesAdminForm.admin_form_fields}>
                  <div>
                    <div className={stylesAdminForm.admin_form_description}>Название фильма</div>
                    <input placeholder='Например, «Гражданин Кейн»' name='filmName' className={stylesAdminForm.admin_form_input} required/>
                  </div>

                  <div>
                    <div className={stylesAdminForm.admin_form_description}>Продолжительность фильма (мин.)</div>
                    <input name='filmDuration' className={stylesAdminForm.admin_form_input} type='number' required/>
                  </div>

                  <div>
                    <div className={stylesAdminForm.admin_form_description}>Описание фильма</div>
                    <textarea name='filmDescription' className={stylesAdminForm.admin_form_input + ' ' + stylesAdminForm.admin_form_textarea} rows={3} required/>
                  </div>
                  
                  <div>
                    <div className={stylesAdminForm.admin_form_description}>Страна</div>
                    <input name='filmOrigin' className={stylesAdminForm.admin_form_input} required/>
                  </div>                                    

                </div>                

                <div className={stylesAdminForm.admin_form_buttons}>
                  <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>ДОБАВИТЬ ФИЛЬМ</button>
                  <label htmlFor='filePoster' className={styles.film_management_poster_label}>
                    <button type='button' onClick={() => {if (inputFileRef.current) inputFileRef.current.click()}} className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>ЗАГРУЗИТЬ ПОСТЕР</button>
                    <input form='addFilmForm' className={styles.film_management_poster_input} ref={inputFileRef} onChange={onPosterChange} id='filePoster' name='filePoster' type='file' required/>
                  </label>
                  <button type="reset" className={stylesAdminForm.admin_form_button}>ОТМЕНИТЬ</button>
                </div>

                {isAddFilmError && <div className={stylesAdminForm.admin_form_error}>Не удалось добавить фильм.</div>}
              </form>
            </div>
          </div>
        }

        {/* {deleteHall && 
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
        } */}

        {isLoading && <LoadingModal />}
      </div>
  )
}