import { getToken } from './auth'
import store from '@/store'

export function getAddressIP(address) {
  let Address
  if (getToken(address)) {
    Address = getToken(address)
    return Address
  } else {
    return store.getters.server[address]
  }
}
