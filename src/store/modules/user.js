import { login } from '@/api/user'
import { getAddress } from '@/api/addresses'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { disconnectCentrifuge } from '@/utils/centrifugo' // get centrifugo Message
import router, { resetRouter } from '@/router'

const state = {
  token: getToken('Admin-Token'),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      /**
      commit('SET_TOKEN', 'admin-token')
        setToken('admin-token')
        resolve(true) */
      login({ username: username.trim(), password: password }).then(res => {
        if (res.Success) {
          const token = res.Inventory
          commit('SET_TOKEN', token)
          setToken('Admin-Token', token)
          // const { data } = res
          // commit('SET_TOKEN', data.token)
          // setToken(data.token)

          // 获取ip
          getAddress().then(
            res => {
              const addresses = res.Inventory
              Object.entries(addresses).forEach(([key, value]) => {
                setToken(key, value)
              })
              resolve(true)
            }
          ).catch(error => {
            console.log(error)
          })
        } else {
          resolve(false)
        }
      }).catch(error => {
        console.log(error)
        if (!error) {
          resolve(false)
        } else {
          reject(error)
        }
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const data = {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }
      commit('SET_ROLES', ['admin'])
      commit('SET_NAME', 'Super Admin')
      commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
      commit('SET_INTRODUCTION', 'I am a super administrator')
      resolve(data)
      /**
       * getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })*/
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('Admin-Token')
      removeToken('prometheus.address')
      removeToken('grafana.address')
      removeToken('centrifugo.address')
      resetRouter()
      disconnectCentrifuge()
      resolve()
      /* logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      }) */
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('Admin-Token')
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken('Admin-Token', token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
