import Centrifuge from 'centrifuge'
import { Notification } from 'element-ui'
import { centrifugeToken } from '@/api/user'
import { getAddressIP } from './address'

let Mycentrifuge

export async function getCentrifuge() {
  const token = await getTokenCentrifuge()
  const wsAddress = await getAddressIP('centrifugo.address')
  if (wsAddress) {
    subscribeCentrifuge(token, wsAddress)
  } else {
    console.log(token)
    console.log(wsAddress)
  }
}

function getTokenCentrifuge() {
  return new Promise((resolve) => {
    centrifugeToken().then(
      res => {
        const token = res.Inventory
        resolve(token)
      }
    ).catch(e => {
      console.log("can't get token:", e)
    })
  })
}

function connectionCentrifuge(wsAddress) {
  const centrifuge = new Centrifuge(`ws://${wsAddress}/connection/websocket`)
  return centrifuge
}

function subscribeCentrifuge(token, wsAddress) {
  Mycentrifuge = connectionCentrifuge(wsAddress)
  Mycentrifuge.setToken(token)
  Mycentrifuge.subscribe('sys:task', function(message) {
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
  })
  Mycentrifuge.on('connect', res => {
    console.log(`ws: ${wsAddress} connecting...`, res)
  })
  Mycentrifuge.on('disconnect', function(context) {
    if (context.reason === 'invalid token') {
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
