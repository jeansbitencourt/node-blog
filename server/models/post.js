const mongoose = require('mongoose')
const Schema = mongoose.Schema

defaultUrl = function(title) {
  if (title != undefined) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const date = new Date().toLocaleDateString('pt-BR', options)
    return date.replace('/', '-') + '-' + title.replace(' ', '-')
  }
  return ''
}

module.exports = function(app) {
  const Category = app.server.models.category
  const Image = app.server.models.image
  const Post = new Schema(
    {
      title: {
        type: String,
        required: true,
        unique: true
      },
      keywords: {
        type: String
      },
      url: {
        type: String,
        default: defaultUrl(this.title),
        lowercase: true
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
      },
      text: {
        type: String
      },
      images: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Image'
        }
      ]
    },
    {
      collection: 'posts'
    }
  )

  return mongoose.model('Post', Post)
}
