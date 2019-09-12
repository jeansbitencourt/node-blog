export default ({ $axios, store, router, cookie }) => {
  $axios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (
        error.response.status === 401 &&
        process.client &&
        error.response.config.url !== '/api/auth'
      ) {
        window.location.assign('/?logout=true')
      } else if (error.response.status !== 200 && process.client) {
        store.dispatch('alert', {
          type: 'error',
          msg:
            'Erro, status ' +
            error.response.status +
            '! ' +
            error.response.data.message
        })
      }
      return Promise.reject(error)
    }
  )
}
