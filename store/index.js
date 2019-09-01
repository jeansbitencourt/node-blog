import Swal from 'sweetalert2'

export const state = () => ({
  blogName: process.env.BLOG_NAME
})

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('category/loadLinks')
  },
  alert({ commit }, { type, msg }) {
    Swal.fire({
      type: type,
      title: msg,
      animation: false,
      customClass: {
        popup: 'animated tada'
      }
    })
  },
  confirm({ commit }, { msg, action }) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: msg,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        action()
      }
    })
  }
}

export const mutations = {}
