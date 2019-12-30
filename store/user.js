export const state = () => ({
  list: [],
  user: {}
})

export const actions = {
  async getList({ commit, dispatch }) {
    await this.$axios
      .get('users')
      .then((res) => {
        if (res.status === 200) {
          commit('setList', res.data)
        } else {
          throw new Error(
            'Erro ao carregar usuários! (status ' + res.status + ')'
          )
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async create({ dispatch }, data) {
    await this.$axios
      .post('users', data.user)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            'alert',
            {
              msg: `Usuário ${res.data.userName} criado com sucesso!`,
              type: 'success'
            },
            {
              root: true
            }
          )
          data.onSuccess()
        } else {
          throw new Error('Erro ao criar usuário! (status ' + res.status + ')')
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async save({ dispatch }, user) {
    await this.$axios
      .put('users', user)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            'alert',
            {
              msg: 'Usuário salvo com sucesso!',
              type: 'success'
            },
            {
              root: true
            }
          )
        } else {
          throw new Error('Erro ao salvar usuário! (status ' + res.status + ')')
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
        msg: 'Deseja excluir este usuário?',
        action: () => {
          this.$axios
            .delete('users/' + item._id)
            .then((res) => {
              if (res.status === 200) {
                dispatch(
                  'alert',
                  {
                    msg: 'Usuário excluído com sucesso!',
                    type: 'success'
                  },
                  {
                    root: true
                  }
                )
                onSuccess()
              } else {
                throw new Error(
                  'Erro ao excluir o usuário! (status ' + res.status + ')'
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
  setList(state, users) {
    state.list = users
  }
}
