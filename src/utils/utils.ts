export function areDatesEqual(dateOne: Date, dateTwo: Date): boolean {
  return (
    dateOne.getFullYear() === dateTwo.getFullYear() &&
    dateOne.getMonth() === dateTwo.getMonth() &&
    dateOne.getDate() === dateTwo.getDate()
  )
}

export function generatePastelColor() {
  const hue = Math.floor(Math.random() * 360)
  const saturation = Math.floor(Math.random() * 31) + 20 // 20–50%
  const lightness = Math.floor(Math.random() * 26) + 70  // 70–95%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}