import moment, { Moment } from 'moment'

export const checkValidTime = (
  timeIndex: any,
  selectedTime: Moment,
  dayArr: any
) => {
  console.log(timeIndex, selectedTime, dayArr)
  if (timeIndex === 0) {
    console.log(dayArr[timeIndex + 1])
    return selectedTime.isBefore(moment(dayArr[timeIndex + 1], 'HH:mm'))
  }
  if (timeIndex === dayArr.length - 1) {
    console.log(dayArr[timeIndex - 1])
    return selectedTime.isAfter(moment(dayArr[timeIndex - 1], 'HH:mm'))
  }
  return selectedTime.isBetween(
    moment(dayArr[timeIndex - 1], 'HH:mm'),
    moment(dayArr[timeIndex + 1], 'HH:mm')
  )
}

export const isBeforeEndOfDay = (timeString: string) => {
  return moment(timeString, 'HH:mm').isBefore(moment('22:00', 'HH:mm'))
}
