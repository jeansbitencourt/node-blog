export default ({ $axios, route, store, redirect }) => {
  if (process.client && store.state.login.userToken) {
    return $axios
      .get('users/thisUser', {
        headers: {
          'x-access-token': store.state.login.userToken
        }
      })
      .catch((e) => {
        console.log(e)
        redirect(route.path + '?logout=true')
      })
  }
}
