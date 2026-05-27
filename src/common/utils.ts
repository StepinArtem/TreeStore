export function getTimesOfDay(): string {
  const currentHour = new Date().getHours()
  let str = ''
  if (currentHour >= 5 && currentHour < 12) {
    str = 'Доброе утро!'
  } else if (currentHour >= 12 && currentHour < 18) {
    str = 'Добрый день!'
  } else if (currentHour >= 18 && currentHour < 23) {
    str = 'Добрый вечер!'
  } else {
    str = 'Доброй ночи!'
  }
  return str
}
