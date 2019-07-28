export const state = () => ({
  blogName: process.env.BLOG_NAME
})

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('category/loadLinks')
  }
}

export const mutations = {}
