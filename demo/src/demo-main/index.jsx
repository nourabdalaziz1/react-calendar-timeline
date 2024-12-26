import React from 'react'
import { Component } from 'react'

import Timeline, { TimelineMarkers, TodayMarker, CustomMarker, CursorMarker } from '../../../src/index'

import generateFakeData from '../generate-fake-data'
import moment from 'moment'

var minTime = moment().add(-6, 'months').valueOf()
var maxTime = moment().add(6, 'months').valueOf()

var keys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start_time',
  itemTimeEndKey: 'end_time',
}

export default class App extends Component {
  constructor(props) {
    super(props)

    const { groups, items } = generateFakeData()
    const defaultTimeStart = moment(items[0].start_time).startOf('day').toDate().valueOf()
    const defaultTimeEnd = moment(items[0].end_time).startOf('day').add(1, 'day').toDate().valueOf()

    this.state = {
      groups,
      items: items.map((item) => {
        return {
          ...item,
          start_time: moment(item.start_time).valueOf(),
          end_time: moment(item.end_time).valueOf(),
        }
      }),
      defaultTimeStart,
      defaultTimeEnd,
    }
  }

  handleCanvasClick = (groupId, time) => {
    console.log('Canvas clicked', groupId, moment(time).format())
  }

  handleCanvasDoubleClick = (groupId, time) => {
    console.log('Canvas double clicked', groupId, moment(time).format())
  }

  handleCanvasContextMenu = (group, time) => {
    console.log('Canvas context menu', group, moment(time).format())
  }

  handleItemClick = (itemId, _, time) => {
    console.log('Clicked: ' + itemId, moment(time).format())
  }

  handleItemSelect = (itemId, _, time) => {
    console.log('Selected: ' + itemId, moment(time).format())
  }

  handleItemDoubleClick = (itemId, _, time) => {
    console.log('Double Click: ' + itemId, moment(time).format())
  }

  handleItemContextMenu = (itemId, _, time) => {
    console.log('Context Menu: ' + itemId, moment(time).format())
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state

    const group = groups[newGroupOrder]

    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id,
            })
          : item,
      ),
    })

    console.log('Moved', itemId, dragTime, newGroupOrder)
  }

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state

    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === 'left' ? time : item.start,
              end: edge === 'left' ? item.end : time,
            })
          : item,
      ),
    })

    console.log('Resized', itemId, time, edge)
  }

  // this limits the timeline to -6 months ... +6 months
  handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime)
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart))
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime)
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
    }
  }

  handleZoom = (timelineContext, unit) => {
    console.log('Zoomed', timelineContext, unit)
  }

  moveResizeValidator = (action, item, time) => {
    if (time < new Date().getTime()) {
      var newTime = Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)
      return newTime
    }

    return time
  }

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state

    return (
      <Timeline
        groups={groups}
        items={items}
        keys={keys}
        sidebarWidth={150}
        sidebarContent={<div>Above The Left</div>}
        canMove
        canResize="right"
        canSelect
        itemsSorted
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        onCanvasClick={this.handleCanvasClick}
        onCanvasDoubleClick={this.handleCanvasDoubleClick}
        onCanvasContextMenu={this.handleCanvasContextMenu}
        onItemClick={this.handleItemClick}
        onItemSelect={this.handleItemSelect}
        onItemContextMenu={this.handleItemContextMenu}
        onItemMove={this.handleItemMove}
        onItemResize={this.handleItemResize}
        onItemDoubleClick={this.handleItemDoubleClick}
        onTimeChange={this.handleTimeChange}
        onZoom={this.handleZoom}
        moveResizeValidator={this.moveResizeValidator}
        buffer={3}
        minZoom={365.24 * 86400 * 1000} // 1 year
        maxZoom={365.24 * 86400 * 1000 * 20} // 20 years
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        resizableCanvas={true}
      >
        <TimelineMarkers>
          <TodayMarker />
          <CustomMarker date={moment().startOf('day').valueOf() + 1000 * 60 * 60 * 2} />
          <CustomMarker date={moment().add(3, 'day').valueOf()}>
            {({ styles }) => {
              const newStyles = { ...styles, backgroundColor: 'blue' }
              return <div style={newStyles} />
            }}
          </CustomMarker>
          {/* <CursorMarker />*/}
        </TimelineMarkers>
      </Timeline>
    )
  }
}
