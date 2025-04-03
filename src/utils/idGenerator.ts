export function generateNumericId(): number {
  const timestamp = Date.now() // Текущее время в миллисекундах
  const randomPart = Math.floor(Math.random() * 1000000) // Случайное число от 0 до 999999
  return timestamp * 1000000 + randomPart // Создаём числовой ID, комбинируя время и случайное число
}
