import axios from 'axios'
export const state = () => ({
  blogName: process.env.BLOG_NAME,
  categories: [],
  userToken: '',
  userData: {},
  loginError: null
})

export const actions = {
  loadLinks({ commit }) {
    axios.get('/api/categories').then((response) => {
      commit('setLinks', response.data)
    })
  },
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
  setLinks(state, categories) {
    const links = []
    links.push({
      name: 'home',
      description: 'HomePage',
      icon: 'home',
      route: '/'
    })
    categories.forEach((category) => {
      category.route = '/category/' + category.name.toLowerCase()
      links.push(category)
    })
    state.categories = links
  },
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
  }
}
