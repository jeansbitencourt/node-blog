const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Image = new Schema(
  {
    name: {
      type: String,
      required: 'Nome da imagem obrigatório!'
    },
    data: {
      type: Buffer,
      required: 'Conteúdo da imagem obrigatório!'
    },
    contentType: {
      type: String,
      required: 'Formato da imagem obrigatório!'
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'images'
  }
)

module.exports = function() {
  return mongoose.model('Image', Image)
}
