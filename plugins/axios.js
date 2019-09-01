export default ({ $axios, store, router, cookie }) => {
  $axios.interceptors.request.use((request) => {
    request.baseURL = '/api/'
    if (process.server) {
      request.baseURL = process.env.API_URL
    }
    const token = store.state.login.userToken
    if (token) {
      request.headers['x-access-token'] = token
    }
    return request
  })

  $axios.interceptors.response.use((response) => {
    if (response.status === 401 && process.client) {
      window.location.assign('/?logout=true')
    }
    return response
  })
}
