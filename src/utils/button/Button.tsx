import styles from './Button.module.css'

interface ButtonProps {
  text: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  isCancel?: boolean
}

export default function Button({text, onClick, isCancel = false}: ButtonProps) {
  let stylesButton = styles.button
  if (isCancel) stylesButton += ' ' + styles.button_cancel
  
  return (
      <button className={stylesButton} onClick={onClick}>{text}</button>
  )
}