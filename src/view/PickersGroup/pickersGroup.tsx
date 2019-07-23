import React, { useState } from 'react'
import { TimePicker, Button, message } from 'antd'
import moment from 'moment'
import _ from 'lodash'

import './pickersGroup.css'
import { checkValidTime, isBeforeEndOfDay, FIRST_INDEX, LAST_INDEX, INBETWEEN_INDEX } from '../../utils'
import { testData, ROWS_LIMIT, days } from '../../contants/date'

interface IPickersGroupProps {
  className: string
}

const FC: React.FC<IPickersGroupProps> = ({
  className,
}: IPickersGroupProps) => {
  const [hours, setHours] = useState<string[][]>(testData)

  const onChange = (newTime: any, dayIndex: number, timeIndex: number) => {
    const dayArr = [...hours[dayIndex]]
    const selectedTime = moment(newTime, 'HH:mm')
    const checkResult = checkValidTime(timeIndex, selectedTime, dayArr)[0]
    if (!checkResult) {
      message.error('The selected time is invalid')
      return
    }
    setHours(oldHours => {
      const newHours = [...oldHours]
      dayArr[timeIndex] = selectedTime.format('HH:mm')
      newHours[dayIndex] = dayArr
      return newHours
    })
  }

  const onAddRow = (dayIndex: number, currentRowEndIndex: number) => {
    const dayArr = [...hours[dayIndex]]
    const startTime = moment(dayArr[currentRowEndIndex + 1], 'HH:mm')
      .add(1, 'hours')
      .format('HH:mm')
    const endTime = moment(dayArr[currentRowEndIndex + 1], 'HH:mm')
      .add(2, 'hours')
      .format('HH:mm')
    dayArr.splice(dayArr.length, 0, startTime, endTime)
    setHours(oldHours => {
      const newHours = [...oldHours]
      newHours[dayIndex] = dayArr
      return newHours
    })
  }

  const onRemoveRow = (dayIndex: number, currentRowEndIndex: number) => {
    const newHours = [...hours]
    const dayArr = [...hours[dayIndex]]
    dayArr.splice(currentRowEndIndex, 2)
    newHours[dayIndex] = dayArr
    setHours(newHours)
  }

  const getEditButton = (
    dayIndex: number,
    currentRowEndIndex: number,
    timesArrayLength: number
  ) => {
    const endTime = hours[dayIndex][timesArrayLength - 1]
    if (timesArrayLength === 2 && !isBeforeEndOfDay(endTime)) {
      return null
    } // single row and end time is at end of the day
    if (timesArrayLength === 2) {
      return (
        <Button
          type="primary"
          onClick={() => onAddRow(dayIndex, currentRowEndIndex)}
        >
          Add
        </Button>
      )
    } // single row
    if (currentRowEndIndex + 2 >= ROWS_LIMIT) {
      return (
        <Button
          type="danger"
          onClick={() => onRemoveRow(dayIndex, currentRowEndIndex)}
        >
          Remove
        </Button>
      )
    } // number of index not greater than limit set
    if (
      currentRowEndIndex + 2 === timesArrayLength &&
      !isBeforeEndOfDay(endTime)
    ) {
      return (
        <Button
          type="danger"
          onClick={() => onRemoveRow(dayIndex, currentRowEndIndex)}
        >
          Remove
        </Button>
      )
    } // last row and end time is after end of the day
    if (currentRowEndIndex + 2 === timesArrayLength) {
      return (
        <>
          <Button
            type="primary"
            onClick={() => onAddRow(dayIndex, currentRowEndIndex)}
          >
            Add
          </Button>
          <Button
            type="danger"
            onClick={() => onRemoveRow(dayIndex, currentRowEndIndex)}
          >
            Remove
          </Button>
        </>
      )
    } // last row
    return null
  }

  const handleDisabledHours = (dayIndex: number, timeIndex: number) => {
    const dayArr = [...hours[dayIndex]]
    const checkResult = checkValidTime(timeIndex, moment(), dayArr)[1]
    const prevEntry = hours[dayIndex][timeIndex - 1]
    const followingEntry = hours[dayIndex][timeIndex + 1]
    const prevHours = moment(prevEntry, "HH:mm").hours()
    const followingHours = moment(followingEntry, "HH:mm").hours()
    switch (checkResult) {
      case FIRST_INDEX:
        return _.range(followingHours + 1, 23, 1)
      case LAST_INDEX:
        return _.range(0, prevHours, 1)
      case INBETWEEN_INDEX:
        const start = _.range(0, prevHours, 1)
        const end = _.range(followingHours + 1, 23, 1)
        return [...start, ...end]
      default:
        return []
    }
  }

  const handleDisabledMinutes = (dayIndex: number, timeIndex: number, selectedHours: number) => {
    const dayArr = [...hours[dayIndex]]
    const checkResult = checkValidTime(timeIndex, moment(), dayArr)[1]
    const prevEntry = hours[dayIndex][timeIndex - 1]
    const followingEntry = hours[dayIndex][timeIndex + 1]
    const prevHours = moment(prevEntry, "HH:mm").hours()
    const followingHours = moment(followingEntry, "HH:mm").hours()
    const prevMins = moment(prevEntry, "HH:mm").minutes()
    const followingMins = moment(followingEntry, "HH:mm").minutes()
    switch (checkResult) {
      case FIRST_INDEX:
        if(selectedHours === followingHours) {
          return _.range(followingMins, 59, 1)
        }
        return []
      case LAST_INDEX:
        if(selectedHours === prevHours) {
          return _.range(0, prevMins + 1, 1)
        }
        return []
      case INBETWEEN_INDEX:
        if(selectedHours === followingHours) {
          return _.range(followingMins, 59, 1)
        }
        if(selectedHours === prevHours) {
          return _.range(0, prevMins + 1, 1)
        }
        return []
      default:
        return []
    }
  }

  return (
    <div className={className}>
      <div className="container">
        {hours.map((timesArr, index) => {
          const rows = []
          for (let i = 0; i < timesArr.length; i += 2) {
            rows.push(
              <div key={`${index}${i}`} className="day-row">
                <div className="pickers">
                  <TimePicker
                    use12Hours={true}
                    minuteStep={5}
                    allowClear={false}
                    format="h:mm a"
                    disabledHours={() => handleDisabledHours(index, i)}
                    disabledMinutes={(selectedHours) => handleDisabledMinutes(index, i, selectedHours)}
                    value={moment(timesArr[i], 'hh:mm')}
                    onChange={timeVal => onChange(timeVal, index, i)}
                  />
                  <TimePicker
                    use12Hours={true}
                    minuteStep={5}
                    allowClear={false}
                    format="h:mm a"
                    disabledHours={() => handleDisabledHours(index, i + 1)}
                    disabledMinutes={(selectedHours) => handleDisabledMinutes(index, i + 1, selectedHours)}
                    value={moment(timesArr[i + 1], 'hh:mm')}
                    onChange={timeVal => onChange(timeVal, index, i + 1)}
                  />
                </div>
                <div className="actions">
                  {getEditButton(index, i, timesArr.length)}
                </div>
              </div>
            )
          }

          return (
            <div key={days[index]}>
              <div className="day-title">{days[index]}</div>
              {rows.map(TimeRow => {
                return TimeRow
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const PickersGroup = FC
