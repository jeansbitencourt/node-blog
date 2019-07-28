import axios from 'axios'
export const state = () => ({
  categories: []
})

export const actions = {
  async loadLinks({ commit }) {
    await axios
      .get(process.env.API_URL + '/categories')
      .then((response) => {
        commit('setLinks', response.data)
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
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
