import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { disconnectCentrifuge } from '@/utils/centrifugo' // get centrifugo Message
import router, { resetRouter } from '@/router'

const state = {
  token: getToken('Admin-Token'),
  name: getToken('username'),
  roleDisabled: getToken('username') !== 'root',
  adminDisabled: getToken('username') === 'admin',
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
  SET_ROLEDISABLED: (state, name) => {
    state.roleDisabled = name !== 'root'
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
    // const { username } = userInfo
    return new Promise((resolve, reject) => {
      /**
      commit('SET_TOKEN', 'admin-token')
        setToken('admin-token')
        resolve(true) */
      /* commit('SET_NAME', username)
      commit('SET_TOKEN', 'Admin-Token')
      commit('SET_ROLEDISABLED', username)
      setToken('Admin-Token', 'Admin-Token')
      setToken('username', username)
      resolve(true) */
      login({ username: username.trim(), password: password }).then(res => {
        if (res.success) {
          const token = res.token
          let name
          if (username === 'bmcadmin') {
            console.log(username)
            name = 'root'
          } else {
            name = username
          }
          commit('SET_NAME', name)
          commit('SET_ROLEDISABLED', name)
          commit('SET_TOKEN', token)
          setToken('Admin-Token', token)
          setToken('username', name)
          resolve(true)

          resolve(true)
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
      let roles = ''
      if (state.name === 'root') {
        roles = ['root']
      } else if (state.name === 'admin') {
        roles = ['admin']
      } else {
        roles = ['editor']
      }
      const data = {
        roles: roles,
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: state.name
      }
      commit('SET_ROLES', roles)
      // commit('SET_NAME', 'Super Admin')
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
  logout({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('Admin-Token')
      removeToken('username')
      removeToken('prometheus.address')
      removeToken('grafana.address')
      removeToken('centrifugo.address')
      dispatch('alarm/clearAlarm', {}, { root: true })
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
