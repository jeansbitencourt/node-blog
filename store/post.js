export const state = () => ({
  list: [],
  post: {}
})

export const actions = {
  async getList({ commit }) {
    await this.$axios
      .get('/posts')
      .then((res) => {
        if (res.status === 200) {
          commit('setList', res.data)
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  }
}

export const mutations = {
  setList(state, posts) {
    state.list = posts
  }
}
