const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const User = new Schema(
  {
    name: {
      firstName: {
        type: String,
        required: 'Nome é obrigatório!'
      },
      lastName: {
        type: String,
        required: 'Sobrenome é obrigatório!'
      }
    },
    userName: {
      type: String,
      lowercase: true,
      trim: true,
      required: 'Nome de usuário é obrigatório!',
      unique: true,
      index: true,
      minlength: [4, 'Nome de usuário precisa ter no mínimo 4 caracteres!'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: 'Endereço de email é obrigatório!',
      unique: true,
      match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email informado é inválido!']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    creationDate: {
      type: Date,
      max: Date.now,
      default: Date.now
    },
    lastLogin: {
      type: Date,
      max: Date.now,
      default: Date.now
    },
    permissions: {
      isAdmin: {
        type: Boolean,
        default: false
      },
      createPosts: {
        type: Boolean,
        default: false
      },
      moderateComments: {
        type: Boolean,
        default: false
      },
      banUsers: {
        type: Boolean,
        default: false
      },
      createComments: {
        type: Boolean,
        default: true
      }
    },
    photo: {
      data: Buffer,
      contentType: String
    }
  },
  {
    collection: 'users'
  }
)

User.plugin(uniqueValidator, { message: 'O {PATH} {VALUE} já foi utilizado por outro usuário!' })

module.exports = function() {
  return mongoose.model('User', User)
}
