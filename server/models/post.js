const mongoose = require('mongoose')
const Schema = mongoose.Schema

defaultUrl = function(title) {
  if (title != undefined) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const date = new Date().toLocaleDateString('pt-BR', options)
    return date.replace('/', '-') + '-' + title.replace(/ /g, '-')
  }
  return ''
}

module.exports = function(app) {
  const Category = app.server.models.category
  const Image = app.server.models.image
  const User = app.server.models.user

  const Log = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      date: {
        type: Date,
        max: Date.now,
        default: Date.now
      },
      action: {
        type: String,
        required: true
      }
    }
  )

  const Post = new Schema(
    {
      title: {
        type: String,
        required: true,
        unique: true
      },
      deleted: {
        type: Boolean,
        default: false
      },
      published: {
        type: Boolean,
        required: true,
        default: false
      },
      keywords: [
        {
          type: String
        }
      ],
      slug: {
        type: String,
        lowercase: true
      },
      creationDate: {
        type: Date,
        max: Date.now,
        default: Date.now
      },
      updateDate: {
        type: Date,
        max: Date.now,
        default: Date.now
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      categories: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Category'
        }
      ],
      text: {
        type: String
      },
      images: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Image'
        }
      ],
      logs: [
        Log
      ]
    },
    {
      collection: 'posts'
    }
  )

  Post.pre('save', function (next) {
    this.slug = defaultUrl(this.get('title'))
    next();
  });

  return mongoose.model('Post', Post)
}
