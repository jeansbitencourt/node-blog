const utils = {
  dateToStr(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return (
      new Date(date).toLocaleDateString('pt-BR', options) +
      ' ' +
      new Date(date).toLocaleTimeString('pt-BR')
    )
  },

  getImageUrl(id) {
    return '/api/images/data/' + id
  }
}

export default utils
