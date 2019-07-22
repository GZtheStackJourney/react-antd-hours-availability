import React, { useState } from 'react'
import { TimePicker, Button } from 'antd'
import moment from 'moment'

import './pickersContainer.css'

interface IPickersGroupProps {
  className: string
}

const ROWS_LIMIT = 8

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const FC: React.FC<IPickersGroupProps> = ({
  className,
}: IPickersGroupProps) => {
  const [hours, setHours] = useState([
    ['09:00', '12:00', '13:00', '18:00'],
    ['09:00', '18:00'],
    ['09:00', '18:00'],
    ['09:00', '18:00'],
    ['09:00', '18:00'],
    ['09:00', '18:00'],
    ['09:00', '18:00'],
  ])
  const [time, setTime] = useState(moment())

  const onChange = (newTime: any) => {
    setTime(newTime)
  }

  const onAddRow = (dayIndex: number, currentRowEndIndex: number) => {
    // which day is it
    // which row is it
    // lenght of the day
    // eg 0 3 4
    //
    console.log(currentRowEndIndex)
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
    console.log(newHours)
    setHours(newHours)
  }

  const onRemoveRow = (dayIndex: number, currentRowEndIndex: number) => {
    const newHours = [...hours]
    const dayArr = [...hours[dayIndex]]
    dayArr.splice(currentRowEndIndex, 2)
    newHours[dayIndex] = dayArr
    console.log(newHours)
    setHours(newHours)
  }

  const getEditButton = (
    dayIndex: number,
    currentRowEndIndex: number,
    timesArrayLength: number
  ) => {
    // current row end index
    // lenght of day times arr
    //
    console.log(currentRowEndIndex, timesArrayLength)
    if(currentRowEndIndex + 2 >= ROWS_LIMIT) {
      return <Button type="danger" onClick={() => onRemoveRow(dayIndex, currentRowEndIndex)}>Remove</Button>
    }
    if (currentRowEndIndex + 2 === timesArrayLength) {
      return (
        <>
          <Button
            type="primary"
            onClick={() => onAddRow(dayIndex, currentRowEndIndex)}
          >
            Add
          </Button>
          <Button type="danger" onClick={() => onRemoveRow(dayIndex, currentRowEndIndex)}>Remove</Button>
        </>
      )
    } else {
      return (
        <>
          <Button type="primary">NAA</Button>
          <Button type="primary">NAA</Button>
        </>
      )
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
                <TimePicker
                  value={moment(timesArr[i], 'hh:mm')}
                  onChange={onChange}
                />
                <TimePicker
                  value={moment(timesArr[i + 1], 'hh:mm')}
                  onChange={onChange}
                />
                {getEditButton(index, i, timesArr.length)}
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

/**
 * [
 *  ["09:00", "18:00"],
 *  ["09:00", "18:00"],
 *  ["09:00", "18:00"],
 *  ["09:00", "18:00"],
 *  ["09:00", "18:00"],
 *  ["09:00", "18:00"]
 *  ["09:00", "18:00"]
 * ]
 */

// loop times
// add times
