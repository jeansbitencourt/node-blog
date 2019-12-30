const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

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
    }
  },
  {
    collection: 'categories'
  }
)

Category.plugin(uniqueValidator, { message: 'O {PATH} {VALUE} já existe!' })

module.exports = function() {
  return mongoose.model('Category', Category)
}
