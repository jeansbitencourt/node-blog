export const state = () => ({
  list: [],
  post: null
})

export const actions = {
  async getList({ commit }) {
    await this.$axios
      .get('posts')
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
  },
  async getPost({ commit }, id) {
    await this.$axios
      .get('posts/' + id)
      .then((res) => {
        if (res.status === 200) {
          commit('setPost', res.data)
        } else {
          commit('setPost', null)
          throw new Error(
            'Erro ao buscar postagem! (status ' + res.status + ')'
          )
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async create({ dispatch, commit }, post) {
    if (!post.coverImage) {
      delete post.coverImage
    }
    await this.$axios
      .post('posts', post)
      .then((res) => {
        if (res.status === 200) {
          commit('setPost', res.data)
          dispatch(
            'alert',
            {
              msg: 'Postagem criada com sucesso!',
              type: 'success'
            },
            {
              root: true
            }
          )
        } else {
          commit('setPost', null)
          throw new Error('Erro ao criar postagem! (status ' + res.status + ')')
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async save({ dispatch, commit }, post) {
    if (!post.coverImage) {
      delete post.coverImage
    }
    await this.$axios
      .put('posts', post)
      .then((res) => {
        if (res.status === 200) {
          commit('setPost', res.data)
          dispatch(
            'alert',
            {
              msg: 'Postagem salva com sucesso!',
              type: 'success'
            },
            {
              root: true
            }
          )
        } else {
          commit('setPost', null)
          throw new Error(
            'Erro ao salvar postagem! (status ' + res.status + ')'
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
        msg: 'Deseja excluir esta postagem?',
        action: () => {
          this.$axios
            .delete('posts/' + item._id)
            .then((res) => {
              if (res.status === 200) {
                dispatch(
                  'alert',
                  {
                    msg: 'Postagem excluída com sucesso!',
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
  setList(state, posts) {
    state.list = posts
  },
  setPost(state, post) {
    state.post = post
  }
}
