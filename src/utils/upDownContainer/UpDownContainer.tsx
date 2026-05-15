import React, { useState } from 'react'
import { basePath } from '../../enum/enum'
import styles from './UpDownContainer.module.css'

interface UpDownContainerProps {
  children: React.ReactNode
  description?: string
  isMinimized?: boolean
  isFirst?: boolean
  isLast?: boolean
}

export default function UpDownContainer({ children, description = '-------', isMinimized = false, isFirst = false, isLast = false }: UpDownContainerProps) {
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
        {!isFirst && <div className={styles.updown_line_top}></div>}
        {!isLast && <div className={styles.updown_line_bottom}></div>}
        <div className={styles.updown_circle}></div>
      </div>
      
      <div className={isMinimizedContainer ? styles.updown_display_none : styles.updown_children_container}>
        <div className={styles.updown_children_line}></div>
        {children}
      </div>
    </>
  )
}