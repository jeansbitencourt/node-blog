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
        dispatch(
          'alert',
          {
            msg: 'Erro ao carregar links! ' + e,
            type: 'error'
          },
          {
            root: true
          }
        )
      })
  },
  async getList({ commit, dispatch }) {
    await this.$axios
      .get('categories')
      .then((res) => {
        if (res.status === 200) {
          commit('setList', res.data)
        } else {
          dispatch(
            'alert',
            {
              msg: 'Erro ao carregar categorias! (status ' + res.status + ')',
              type: 'error'
            },
            {
              root: true
            }
          )
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
        dispatch(
          'alert',
          {
            msg: 'Erro ao carregar categorias! ' + e,
            type: 'error'
          },
          {
            root: true
          }
        )
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
          dispatch(
            'alert',
            {
              msg: 'Erro ao criar categoria! (status ' + res.status + ')',
              type: 'error'
            },
            {
              root: true
            }
          )
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
        dispatch(
          'alert',
          {
            msg: 'Erro ao criar categoria! ' + e,
            type: 'error'
          },
          {
            root: true
          }
        )
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
          dispatch(
            'alert',
            {
              msg: 'Erro ao criar categoria! (status ' + res.status + ')',
              type: 'error'
            },
            {
              root: true
            }
          )
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
        dispatch(
          'alert',
          {
            msg: 'Erro ao criar categoria! ' + e,
            type: 'error'
          },
          {
            root: true
          }
        )
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
                dispatch(
                  'alert',
                  {
                    msg:
                      'Erro ao excluir categoria! (status ' + res.status + ')',
                    type: 'error'
                  },
                  {
                    root: true
                  }
                )
              }
            })
            .catch((e) => {
              /* eslint-disable no-console */
              console.log(e)
              /* eslint-enable no-console */
              dispatch(
                'alert',
                {
                  msg: 'Erro ao excluir categoria! ' + e,
                  type: 'error'
                },
                {
                  root: true
                }
              )
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
