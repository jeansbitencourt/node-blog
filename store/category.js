export const state = () => ({
  categories: [],
  list: [],
  category: {}
})

export const actions = {
  async loadLinks({ commit, dispatch }) {
    await this.$axios
      .get('categories')
      .then((response) => {
        commit('setLinks', response.data)
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async getList({ commit, dispatch }) {
    await this.$axios
      .get('categories')
      .then((res) => {
        if (res.status === 200) {
          commit('setList', res.data)
        } else {
          throw new Error(
            'Erro ao carregar categorias! (status ' + res.status + ')'
          )
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async create({ dispatch }, category) {
    await this.$axios
      .post('categories', category)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            'alert',
            {
              msg: 'Categoria criada com sucesso!',
              type: 'success'
            },
            {
              root: true
            }
          )
        } else {
          throw new Error(
            'Erro ao criar categoria! (status ' + res.status + ')'
          )
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async save({ dispatch }, category) {
    await this.$axios
      .put('categories', category)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            'alert',
            {
              msg: 'Categoria salva com sucesso!',
              type: 'success'
            },
            {
              root: true
            }
          )
        } else {
          throw new Error(
            'Erro ao salvar categoria! (status ' + res.status + ')'
          )
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async delete({ dispatch }, { item, onSuccess }) {
    await dispatch(
      'confirm',
      {
        msg: 'Deseja excluir esta categoria?',
        action: () => {
          this.$axios
            .delete('categories/' + item._id)
            .then((res) => {
              if (res.status === 200) {
                dispatch(
                  'alert',
                  {
                    msg: 'Categoria excluída com sucesso!',
                    type: 'success'
                  },
                  {
                    root: true
                  }
                )
                onSuccess()
              } else {
                throw new Error(
                  'Erro ao excluir a categoria! (status ' + res.status + ')'
                )
              }
            })
            .catch((e) => {
              /* eslint-disable no-console */
              console.log(e)
              /* eslint-enable no-console */
            })
        }
      },
      {
        root: true
      }
    )
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
  setList(state, posts) {
    state.list = posts
  }
}
