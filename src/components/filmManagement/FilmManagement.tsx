import { useState, useRef, useMemo } from 'react'
import type { FormEvent, Dispatch, SetStateAction } from 'react'
import type { FilmType, HallType, SeanceType } from '../../types/types.ts'
import { basePath } from '../../enum/enum.ts'
import { getResponseFromForm, getResponse } from '../../utils/response.ts'
import { generatePastelColor } from '../../utils/utils.ts'
import LoadingModal from '../../utils/loadingModal/LoadingModal.tsx'
import Button from '../../utils/button/Button.tsx'
import styles from './FilmManagement.module.css'
import stylesAdminForm from  '../../css/FormAdmin.module.css'

interface FilmManagementProps {
  films: FilmType[] | undefined
  halls: HallType[] | undefined
  seances: SeanceType[] | undefined
  setIsUpdateData: Dispatch<SetStateAction<boolean>>
}

interface FilmProps {
  film: FilmType
}

interface HallProps {
  hall: HallType
}

interface SeanceProps {
  seance: SeanceType
}

export default function FilmManagement({films, halls, seances, setIsUpdateData}: FilmManagementProps) {
  const [isAddFilm, setIsAddFilm] = useState(false)
  const [isAddFilmError, setIsAddFilmError] = useState(false)
  const [deleteFilm, setDeleteFilm] = useState<FilmType | null>(null)
  const [isDeleteFilmError, setIsDeleteFilmError] = useState(false)
  const [isAddSeance, setIsAddSeance] = useState(false)
  const [isAddSeanceError, setIsAddSeanceError] = useState(false)
  const [selectedFilm, setSelectedFilm] = useState<FilmType | null>(null)
  const [selectedHall, setSelectedHall] = useState<HallType | null>(null)
  const [isLoading, setIsLoading] = useState(false)  
  const inputFileRef = useRef<HTMLInputElement>(null)

  const filmsBackground = useMemo<Record<number, string>>(() => {
    if (!films) return {}
    const backgroundMap: Record<number, string> = {}
    for (const film of films) {
      backgroundMap[film.id] = generatePastelColor()
    }
    return backgroundMap
  }, [films])

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

  async function onSubmitDelete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await getResponse(`/film/${deleteFilm?.id}`, 'DELETE')
      const data = await response.json()

      if (data.success) {
        setDeleteFilm(null)
        setIsUpdateData((current) => !current)
      } else {
        setIsDeleteFilmError(true)
      }
      
    } catch(e) {
      console.error(e)
    }
    
    setIsLoading(false)
  }

  function onResetDelete() {
    setDeleteFilm(null)
    setIsDeleteFilmError(false)
  }

  async function onSubmitAddSeance(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsLoading(true)
    
    const form = new FormData(e.currentTarget)
    form.append('seanceHallid', String(selectedHall?.id))
    form.append('seanceFilmid', String(selectedFilm?.id))

    try {
      const response = await getResponseFromForm('/seance', 'POST', form)
      const data = await response.json()

      if (data.success) {
        setIsAddSeance(false)
        setSelectedFilm(null)
        setSelectedHall(null)        
        setIsUpdateData((current) => !current)
      } else {
        setIsAddSeanceError(true)
      }
      
    } catch(e) {
      console.error(e)
    }
    
    setIsLoading(false)
  }

  function onResetAddSeance() {
    setIsAddSeance(false)
    setSelectedFilm(null)
    setSelectedHall(null)
    setIsAddSeanceError(false)
  }  


  function Film({film}: FilmProps) {
    return (
      <div 
        className={styles.film_management_film} 
        style={{backgroundColor: filmsBackground[film.id]}}
        draggable
        onDrag={() => setSelectedFilm(film)}
      >
        <img src={film.film_poster} className={styles.film_management_film_poster}/>
        <div className={styles.film_management_description_container}>
          <div className={styles.film_management_name}>{film.film_name}</div>
          <div className={styles.film_management_duration}>{film.film_duration} минут</div>
        </div>

        <div className={styles.film_management_delete} onClick={() => setDeleteFilm(film)}>
          <img src={basePath + '/delete.svg'} alt="Удалить" />
        </div>
      </div>
    )
  }

  function Seance({seance}: SeanceProps) {
    const film = films?.find(film => film.id === seance.seance_filmid)
    
    return (
      <div className={styles.film_management_hall_seance} style={{backgroundColor: film?.id ? filmsBackground[film.id] : ''}}>
        <span>{film?.film_name}</span>
        <div className={styles.film_management_hall_seance_time}>{seance.seance_time}</div>
        <div className={styles.film_management_hall_seance_time_line}></div>
      </div>  
    )
  }

  function Hall({hall}: HallProps) {
    function onDragOver(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }

    function onDrop(e: React.DragEvent<HTMLDivElement>) {
      e.preventDefault()
      setSelectedHall(hall)
      setIsAddSeance(true)
    }
    
    return (
      <div onDragOver={onDragOver} onDrop={onDrop}>
        <div className={styles.film_management_hall_name}>{hall.hall_name}</div>
        <div className={styles.film_management_hall_time}>
          {seances?.filter(value => value.seance_hallid === hall.id).sort((a, b) => a.seance_time.localeCompare(b.seance_time)).map((seance, index) => <Seance key={index} seance={seance}/>)}
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

        <div className={styles.film_management_halls}>
          {halls && halls.length > 0 ? (halls?.map((hall, index) => <Hall key={index} hall={hall} />)) : (<div>Залов не найдено</div>)}          
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

        {deleteFilm && 
          <div className={stylesAdminForm.admin_form_modal}>
            <div className={stylesAdminForm.admin_form_container}>
              <div className={stylesAdminForm.admin_form_header}>УДАЛЕНИЕ ФИЛЬМА</div>
              <form className={stylesAdminForm.admin_form} onSubmit={onSubmitDelete} onReset={onResetDelete}>
                <div className={stylesAdminForm.admin_form_caption}>Вы хотите удалить фильм - <span>{deleteFilm.film_name}?</span></div>

                <div className={stylesAdminForm.admin_form_buttons}>
                  <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>УДАЛИТЬ ФИЛЬМ</button>
                  <button type="reset" className={stylesAdminForm.admin_form_button}>ОТМЕНИТЬ</button>
                </div>

                {isDeleteFilmError && <div className={stylesAdminForm.admin_form_error}>Не удалось удалить фильм.</div>}
              </form>
            </div>
          </div>
        }

        {isAddSeance && 
          <div className={stylesAdminForm.admin_form_modal}>
            <div className={stylesAdminForm.admin_form_container + ' ' + stylesAdminForm.admin_form_container_wide}>
              <div className={stylesAdminForm.admin_form_header}>ДОБАВЛЕНИЕ СЕАНСА</div>
              <form className={stylesAdminForm.admin_form} onSubmit={onSubmitAddSeance} onReset={onResetAddSeance}>

                <div  className={stylesAdminForm.admin_form_fields}>
                  <div>Фильм: {selectedFilm?.film_name}</div>
                  <div>Кинозал: {selectedHall?.hall_name}</div>

                  <div>
                    <div className={stylesAdminForm.admin_form_description}>Время начала</div>
                    <input type='time' placeholder='15:00' name='seanceTime' className={stylesAdminForm.admin_form_input} required/>
                  </div>                                    

                </div>                

                <div className={stylesAdminForm.admin_form_buttons}>
                  <button type="submit" className={stylesAdminForm.admin_form_button + ' ' + stylesAdminForm.admin_form_button_submit}>ДОБАВИТЬ СЕАНС</button>
                  <button type="reset" className={stylesAdminForm.admin_form_button}>ОТМЕНИТЬ</button>
                </div>

                {isAddSeanceError && <div className={stylesAdminForm.admin_form_error}>Не удалось добавить сеанс.</div>}
              </form>
            </div>
          </div>
        }

        {isLoading && <LoadingModal />}
      </div>
  )
}