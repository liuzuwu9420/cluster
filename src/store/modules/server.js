// import { getServerAddress } from '@/api/consul'
// const Base64 = require('js-base64').Base64
// import { setToken } from '@/utils/auth'

const state = {
  address: {}
}

/* getServerAddress().then((res) => {
  res.map((item) => {
    state.address[item.Key.replace(/sofa\/sys\/settings\//, '')] = Base64.decode(item.Value)
    setToken(item.Key.replace(/sofa\/sys\/settings\//, ''), Base64.decode(item.Value))
  })
}) */
const mutations = {
  CHANGE_ADDRESS: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeAddress({ commit }, data) {
    commit('CHANGE_ADDRESS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

