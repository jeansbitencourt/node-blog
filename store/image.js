export const state = () => ({
  list: [],
  image: null
})

export const actions = {
  async getList({ commit }) {
    await this.$axios
      .get('images')
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
  async getImage({ commit }, id) {
    await this.$axios
      .get('images/' + id)
      .then((res) => {
        if (res.status === 200) {
          commit('setImage', res.data)
        } else {
          commit('setImage', null)
          throw new Error('Erro ao buscar imagem! (status ' + res.status + ')')
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async create({ dispatch, commit }, file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', file.name)
    await this.$axios
      .post('images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        if (res.status === 200) {
          commit('setImage', res.data)
          dispatch(
            'alert',
            {
              msg: 'Imagem salva com sucesso!',
              type: 'success'
            },
            {
              root: true
            }
          )
        } else {
          commit('setImage', null)
          throw new Error('Erro ao salvar imagem! (status ' + res.status + ')')
        }
      })
      .catch((e) => {
        /* eslint-disable no-console */
        console.log(e)
        /* eslint-enable no-console */
      })
  },
  async save({ dispatch, commit }, image) {
    await this.$axios
      .put('images', image)
      .then((res) => {
        if (res.status === 200) {
          commit('setImage', res.data)
          dispatch(
            'alert',
            {
              msg: 'Imagem salva com sucesso!',
              type: 'success'
            },
            {
              root: true
            }
          )
        } else {
          commit('setImage', null)
          throw new Error('Erro ao salvar imagem! (status ' + res.status + ')')
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
        msg: 'Deseja excluir esta imagem?',
        action: () => {
          this.$axios
            .delete('images/' + item._id)
            .then((res) => {
              if (res.status === 200) {
                dispatch(
                  'alert',
                  {
                    msg: 'Imagem excluída com sucesso!',
                    type: 'success'
                  },
                  {
                    root: true
                  }
                )
                onSuccess()
              } else {
                throw new Error(
                  'Erro ao excluir a imagem! (status ' + res.status + ')'
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
  setList(state, images) {
    state.list = images
  },
  setImage(state, image) {
    state.image = image
  }
}
