import moment, { Moment } from 'moment'

export const FIRST_INDEX = 'index0'
export const LAST_INDEX = 'indexL'
export const INBETWEEN_INDEX = 'inbetween'

export const checkValidTime = (
  timeIndex: any,
  selectedTime: Moment,
  dayArr: any
) => {
  if (timeIndex === 0) {
    const result0 = selectedTime.isBefore(moment(dayArr[timeIndex + 1], 'HH:mm'))
    return [result0, FIRST_INDEX]
  }
  if (timeIndex === dayArr.length - 1) {
    const result1 = selectedTime.isAfter(moment(dayArr[timeIndex - 1], 'HH:mm'))
    return [result1, LAST_INDEX]
  }
  const ibIndex = selectedTime.isBetween(
    moment(dayArr[timeIndex - 1], 'HH:mm'),
    moment(dayArr[timeIndex + 1], 'HH:mm')
  )
  return [ibIndex, INBETWEEN_INDEX]
}

export const isBeforeEndOfDay = (timeString: string) => {
  return moment(timeString, 'HH:mm').isBefore(moment('22:00', 'HH:mm'))
}
