import React from 'react'
import { TimePicker } from 'antd'
import { TimePickerProps } from 'antd/lib/time-picker'

export const CustomTimePicker = (props: TimePickerProps) => {
  return (
    <TimePicker
      use12Hours={true}
      minuteStep={5}
      allowClear={false}
      format="h:mm a"
      {...props}
    />
  )
}
