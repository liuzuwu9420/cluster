import Centrifuge from 'centrifuge'
// import { Notification } from 'element-ui'
import store from '@/store'
import { centrifugeToken } from '@/api/centrifugo'
import { formatDate } from '@/utils/format'
// import { getAddressIP } from './address'

let Mycentrifuge

export async function getCentrifuge() {
  const token = await getTokenCentrifuge()
  // const wsServerAddress = window.location.hostname
  const wsServerAddress = 'node-dev.xtc.home'
  // const wsServerAddress = await getAddressIP('centrifugo.address')
  if (wsServerAddress) {
    subscribeCentrifuge(token, wsServerAddress)
  } else {
    console.log(token)
    console.log(wsServerAddress)
  }
}

function getTokenCentrifuge() {
  return new Promise((resolve) => {
    centrifugeToken().then(
      res => {
        const token = res
        resolve(token)
      }
    ).catch(e => {
      console.log("can't get token:", e)
    })
  })
}

function connectionCentrifuge(wsServerAddress) {
  const centrifuge = new Centrifuge(`ws://${wsServerAddress}/centrifugo/connection/websocket`)
  return centrifuge
}

function subscribeCentrifuge(token, wsServerAddress) {
  Mycentrifuge = connectionCentrifuge(wsServerAddress)
  Mycentrifuge.setToken(token)
  /* Mycentrifuge.subscribe('sys:task', function(message) {
    console.log('sys:task,return message', message)
    Notification({
      title: '操作消息',
      message: message.data.Status,
      type: 'warning'
    })
  })
  Mycentrifuge.subscribe('lsf:job', function(message) {
    console.log('lsf:job,return message', message)
    Notification({
      title: '作业消息',
      message: message.data.JobID + ': ' + message.data.CurrentStatus,
      type: 'warning'
    })
  }) */
  Mycentrifuge.subscribe('prometheus', function(message) {
    let messageData = ''
    message.data.alerts.map((alertItem) => {
      const startsAt = formatDate(alertItem.startsAt)
      let color = null
      if (alertItem.labels.severity === '紧急' || alertItem.labels.severity === '非常严重' || alertItem.labels.severity === '严重告警') {
        color = '#f44336'
      } else if (alertItem.labels.severity === '严重') {
        color = '#ff9800'
      } else if (alertItem.labels.severity === '提示') {
        color = '#00bcd4'
      } else {
        color = '#9e9e9e'
      }
      messageData += `
        <div style='margin-bottom: 10px;    margin-right: 12px; width:300px;'>
          <div style='font-size: 16px'><i class='el-icon-warning' style='color: ${color}'></i> ${alertItem.labels.severity}</div>
          <div style='margin-left: 10px'>
          <div>instance: ${alertItem.labels.instance}</div>
          <div>summary: ${alertItem.annotations.summary}</div>
          </div>
          <div style='text-align: right; margin-right: 12px;'>${startsAt}</div>
        </div>
        `
    })
    store.dispatch('alarm/setAlarm', messageData)
    /* Notification({
      title: '报警消息',
      dangerouslyUseHTMLString: true,
      message: messageData,
      offset: 95
    }) */
  })
  Mycentrifuge.on('connect', res => {
    console.log(`ws: ${wsServerAddress} connecting...`, res)
  })
  Mycentrifuge.on('disconnect', function(context) {
    if (!context.reconnect) {
      console.log(context)
    }
  })
  Mycentrifuge.connect()
}

export async function disconnectCentrifuge() {
  console.log('关闭连接==>>', Mycentrifuge)
  if (Mycentrifuge) {
    Mycentrifuge.disconnect()
    console.log(`连接已关闭`)
  }
}
