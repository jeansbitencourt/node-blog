const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
  {
    name: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      }
    },
    userName: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      index: true,
      minlength: 4
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true
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

module.exports = function() {
  return mongoose.model('User', User)
}
