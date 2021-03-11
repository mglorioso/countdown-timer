import React, { useState, useEffect } from 'react'

import { Button, Container, Table } from 'semantic-ui-react'

import { start, stop } from '../constants/log-types'

import TimerService from '../services/TimerService'

import { current_date } from '../utils/DateFormatter'

import DataTable from '../ui/DataTable'

import { connect } from 'react-redux'

import { getTimerLogs, setTimerLogs } from '../actions/getTimerLogs'
import { addTimer, updateTimer } from '../actions/saveTimer'


function TimerLogs(props) {
  const { timerlogs, timer, getTimerLogs } = props
  const tblheader = [
    'ID',
    'Timestamp',
    'Log Type',
    'Action'
  ]

  useEffect(() => {
    getTimerLogs() // with thunk
  }, [getTimerLogs]);

  // add and & update timer
  const saveTimer = async () => {
    if (timer.log_type === start) {
      // add timer
      const req_body = {
        ...timer,
        timestamp: current_date()
      }
      try {
        const response = await TimerService.add(req_body)

        getTimerLogs() // with thunk
        props.addTimer({ ...req_body, log_type: stop })
      }
      catch (error) {
        if (error.response) {
          console.log(error.response.data)
        }
        else if (error.request) {
          console.log(error.request)
        }
        else {
          console.log(error.message)
        }
      }
    }
    else {
      // update timer
      const params = {
        ...timer,
        log_type: start
      }
      const req_body = {
        ...timer,
        timestamp: current_date()
      }
      try {
        const response = await
          TimerService.update(params.timestamp, params.log_type, req_body)

        getTimerLogs() // with thunk
        props.updateTimer({ ...req_body, log_type: start })
      }
      catch (error) {
        if (error.response) {
          console.log(error.response.data)
        }
        else if (error.request) {
          console.log(error.request)
        }
        else {
          console.log(error.message)
        }
      }
    }
  }

  // delete timer
  const deleteTimer = async id => {
    try {
      const response = await TimerService.remove(id)
      getTimerLogs() // with thunk
    }
    catch (error) {
      if (error.response) {
        console.log(error.response.data)
      }
      else if (error.request) {
        console.log(error.request)
      }
      else {
        console.log(error.message)
      }
    }
  }

  return (
    <Container>
      <center style={{ 'paddingTop': '20px' }}>
        <Button onClick={saveTimer}>{timer.log_type}</Button>
      </center>
      <DataTable small className='timer-table' header={tblheader} data={timerlogs} onDelete={deleteTimer} />
    </Container>
  )
}

const mapStateToProps = state => {
  return {
    timerlogs: state.timerlogs,
    timer: state.timer
  }
}
const mapDispatchToProps = {
  getTimerLogs,
  addTimer, updateTimer
}

export default connect(mapStateToProps, mapDispatchToProps)(TimerLogs)
