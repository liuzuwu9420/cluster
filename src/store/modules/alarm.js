const state = sessionStorage.getItem('alarm') ? JSON.parse(sessionStorage.getItem('alarm')) : {
  alarmList: []
}

const mutations = {
  SET_ALARM: (state, alarm) => {
    if (state.alarmList.length >= 100) {
      state.alarmList.pop()
    }
    state.alarmList.push(alarm)
  },
  CLEAR_ALARM: (state) => {
    sessionStorage.removeItem('alarm')
    state.alarmList = []
  }
}

const actions = {
  setAlarm({ commit }, alarm) {
    commit('SET_ALARM', alarm)
  },
  clearAlarm({ commit }) {
    commit('CLEAR_ALARM')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

