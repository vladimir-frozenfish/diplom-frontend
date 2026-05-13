import React, { useState } from 'react'
import { basePath } from '../../enum/enum'
import styles from './UpDownContainer.module.css'

interface UpDownContainerProps {
  children: React.ReactNode
  description?: string
  isMinimized?: boolean
}

export default function UpDownContainer({ children, description = '-------', isMinimized = false }: UpDownContainerProps) {
  const [ isMinimizedContainer, setIsMinimizedContainer ] = useState(isMinimized)

  const onClickDescription = () => {
    setIsMinimizedContainer(!isMinimizedContainer)
  }
  
  return (
    <>
      <div className={styles.updown} onClick={onClickDescription}>
        <div className={styles.updown_description}>{description}</div>
        {
          !isMinimizedContainer 
          ? <img className={styles.updown_img_rotate} src={basePath + '/chevron.svg'}/> 
          : <img src={basePath + '/chevron.svg'}/> 
        }
        <div className={styles.updown_line}></div>
        <div className={styles.updown_circle}></div>
      </div>
      
      <div className={isMinimizedContainer ? styles.updown_display_none : ''}>
        {children}
      </div>
    </>
  )
}