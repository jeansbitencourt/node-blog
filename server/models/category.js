const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')


module.exports = function(app) {
  const Category = new Schema(
    {
      name: {
        type: String,
        required: 'Nome obrigatório!',
        unique: true
      },
      description: {
        type: String,
        required: 'Descrição obrigatória!'
      },
      icon: {
        type: String
      },
      creationDate: {
        type: Date,
        max: Date.now,
        default: Date.now
      },
      slug: {
        type: String,
        lowercase: true
      }
    },
    {
      collection: 'categories'
    }
  )

  Category.plugin(uniqueValidator, { message: 'O {PATH} {VALUE} já existe!' })

  Category.pre('save', function (next) {
    this.slug = app.server.utils.functions.convertToSlug(this.get('name'))
    next()
  })

  return mongoose.model('Category', Category)
}
