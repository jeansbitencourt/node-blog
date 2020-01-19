export const state = () => ({
  list: [],
  post: null,
  page: null,
  count: 0
})

export const actions = {
  async getListLast({ commit }, page) {
    await this.$axios
      .get('posts/last/' + page)
      .then((res) => {
        if (res.status === 200) {
          commit('setListLast', {
            data: res.data,
            page: page
          })
        } else {
          commit('setListLast', null)
          throw new Error(
            'Erro ao buscar postagens! (status ' + res.status + ')'
          )
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async getListByCategory({ commit }, { categoryId, page }) {
    await this.$axios
      .get(`posts/category/${categoryId}/${page}`)
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
  async getPostBySlug({ commit }, slug) {
    await this.$axios
      .get('posts/slug/' + slug)
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
  },
  setListLast(state, { data, page }) {
    state.count = data.count
    if (page > 1) {
      data.post.forEach((post) => {
        state.list.push(post)
      })
    } else {
      state.list = data.post
    }
  },
  setPage(state, page) {
    state.page = page
  }
}
