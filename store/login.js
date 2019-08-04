import axios from 'axios'
export const state = () => ({
  userToken: '',
  userData: {},
  loginError: null
})

export const actions = {
  login({ commit }, payload) {
    if (!payload.token) {
      axios
        .post('/api/auth', {
          userName: payload.userName,
          password: payload.password
        })
        .then((response) => {
          payload.token = response.data.token
          payload.user = JSON.stringify(response.data.user)
          commit('setUserToken', payload)
        })
        .catch((err) => {
          commit('setLoginError', err)
        })
    } else {
      commit('setUserToken', payload)
    }
  },
  logout({ commit }, payload) {
    commit('removeUserToken', payload)
  }
}

export const mutations = {
  setUserToken(state, data) {
    state.userToken = data.token
    state.userData = JSON.parse(data.user)
    if (data.cookie) {
      data.cookie.set('tkUser', data.token, 1)
      if (data.user) {
        data.cookie.set('dtUser', data.user, 1)
      }
    }
    state.loginError = null
  },
  setLoginError(state, err) {
    state.loginError = err
  },
  removeUserToken(state, data) {
    state.userToken = ''
    state.userData = {}
    data.cookie.delete('tkUser')
    data.cookie.delete('dtUser')
    data.router.push('/')
  }
}
