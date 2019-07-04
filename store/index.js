export const state = () => ({
  blogName: 'Jean Bitencourt',
  blogUri: 'http://localhost:4000',
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  }
}
