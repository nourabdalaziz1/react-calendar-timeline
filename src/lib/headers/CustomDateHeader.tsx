import React from 'react'
import Interval from './Interval'
import { Interval as IntervalType, IntervalRenderer } from '../types/main'
import { Moment } from 'moment'
import { SelectUnits } from '../utility/calendar'
import { GetIntervalPropsType } from './types'

export interface CustomDateHeaderProps<Data> {
  headerContext: {
    intervals: IntervalType[]
    unit: SelectUnits
  }
  getRootProps: (props?: any) => any
  getIntervalProps: GetIntervalPropsType
  showPeriod: (start: Moment, end: Moment) => void
  data: {
    style: React.CSSProperties
    intervalRenderer: (props: IntervalRenderer<Data>) => React.ReactNode
    className?: string
    getLabelFormat: (interval: [Moment, Moment], unit: string, labelWidth: number) => string
    unitProp?: 'primaryHeader'
    headerData?: Data
  }
}

export function CustomDateHeader<Data>({
  headerContext: { intervals, unit },
  getRootProps,
  getIntervalProps,
  showPeriod,
  data: { style, intervalRenderer, className, getLabelFormat, unitProp, headerData },
}: CustomDateHeaderProps<Data>) {
  return (
    <div data-testid={`dateHeader`} className={className} {...getRootProps({ style })}>
      {intervals.map((interval) => {
        const intervalText = getLabelFormat([interval.startTime, interval.endTime], unit, interval.labelWidth)
        return (
          <Interval
            key={`label-${interval.startTime.valueOf()}`}
            unit={unit}
            interval={interval}
            showPeriod={showPeriod}
            intervalText={intervalText}
            primaryHeader={unitProp === 'primaryHeader'}
            getIntervalProps={getIntervalProps}
            intervalRenderer={intervalRenderer as any}
            headerData={headerData}
          />
        )
      })}
    </div>
  )
}
