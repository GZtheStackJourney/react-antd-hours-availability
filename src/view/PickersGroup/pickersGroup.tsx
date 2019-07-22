import React, { useState } from 'react'
import { TimePicker, Button, message } from 'antd'
import moment from 'moment'

import './pickersGroup.css'
import { checkValidTime, isBeforeEndOfDay } from '../../utils'
import { testData, ROWS_LIMIT, days } from '../../contants/date'

interface IPickersGroupProps {
  className: string
}

const FC: React.FC<IPickersGroupProps> = ({
  className,
}: IPickersGroupProps) => {
  const [hours, setHours] = useState<string[][]>(testData)

  const onChange = (newTime: any, dayIndex: number, timeIndex: number) => {
    const newHours = [...hours]
    const dayArr = [...hours[dayIndex]]
    const selectedTime = moment(newTime, 'HH:mm')
    if (!checkValidTime(timeIndex, selectedTime, dayArr)) {
      message.error('The selected time is invalid')
      return
    }
    dayArr[timeIndex] = selectedTime.format('HH:mm')
    newHours[dayIndex] = dayArr
    setHours(newHours)
  }

  const onAddRow = (dayIndex: number, currentRowEndIndex: number) => {
    const newHours = [...hours]
    const dayArr = [...hours[dayIndex]]
    const startTime = moment(dayArr[currentRowEndIndex + 1], 'HH:mm')
      .add('hours', 1)
      .format('HH:mm')
    const endTime = moment(dayArr[currentRowEndIndex + 1], 'HH:mm')
      .add('hours', 2)
      .format('HH:mm')
    dayArr.splice(dayArr.length, 0, startTime, endTime)
    newHours[dayIndex] = dayArr
    setHours(newHours)
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

  // const handleDisabledHours = () => {

  // }

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
                    disabledHours={() => [1,2]}
                    value={moment(timesArr[i], 'hh:mm')}
                    onChange={timeVal => onChange(timeVal, index, i)}
                  />
                  <TimePicker
                    use12Hours={true}
                    minuteStep={5}
                    allowClear={false}
                    format="h:mm a"
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
