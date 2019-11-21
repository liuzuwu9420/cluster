import Centrifuge from 'centrifuge'
import { centrifugeToken } from '@/api/user'

export function getCentrifuge() {
  centrifugeToken().then(
    res => {
      const token = res.Inventory
      console.log(token)
      const centrifuge = new Centrifuge('ws://node-dev.xtc.home:8000/connection/websocket')
      centrifuge.setToken(token)
      centrifuge.subscribe('test', function(message) {
        console.log(message)
      })
      centrifuge.connect()
    }
  )
}
