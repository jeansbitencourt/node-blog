export default ({ $axios, route, store, redirect }) => {
  if (process.client) {
    if (
      !store.state.login.userData ||
      !store.state.login.userData.permissions ||
      !store.state.login.userData.permissions.createPosts
    ) {
      return redirect('/')
    }
  } else {
    return $axios
      .get('users/thisUser', {
        headers: {
          'x-access-token': route.params.token
        }
      })
      .then((response) => {
        if (!response.data.permissions.createPosts) {
          redirect('/')
        }
      })
      .catch(() => {
        redirect('/')
      })
  }
}
