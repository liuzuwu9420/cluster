import { getAddressByName } from '@/api/addresses'
import { getToken } from './auth'

export function getAddressIP(address) {
  let Address
  if (getToken(address)) {
    Address = getToken(address)
    return Address
  } else {
    return new Promise((resolve) => {
      getAddressByName(address)
        .then(data => {
          if (address === 'centrifugo.address') {
            Address = data.Inventory['centrifugo.address']
            resolve(Address)
          } else if (address === 'grafana.address') {
            Address = data.Inventory['grafana.address']
            resolve(Address)
          } else if (address === 'prometheus.address') {
            Address = data.Inventory['prometheus.address']
            resolve(Address)
          }
        })
        .catch(error => console.log(`can't get ${address}:`, error))
    })
  }
}
