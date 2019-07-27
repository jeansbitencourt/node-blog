import axios from 'axios'
export const state = () => ({
  categories: []
})

export const actions = {
  loadLinks({ commit }) {
    axios.get('/api/categories').then((response) => {
      commit('setLinks', response.data)
    })
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
  }
}
