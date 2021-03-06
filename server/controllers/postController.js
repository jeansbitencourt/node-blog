newLog = function(user, action) {
  return {
    user: user,
    action: action
  }
}

module.exports.list = function(app, req, res) {
  app.server.models.user.findById(req.body.userId, function (err, user) {
    if (err) res.status(400).json(err)
    let find = {
      deleted: false
    }
    if (user && (user.permissions.isAdmin)){
      find = {}
    }
    app.server.models.post
      .find(find)
      .populate('categories')
      .populate('coverImage', 'name _id uploadDate')
      .populate('images', 'name _id uploadDate')
      .populate('createdBy', 'name _id userName')
      .populate('logs.user', 'name _id userName')
      .exec(function(err, posts) {
        if (err) {
          res.status(400).json(err)
        } else {
          res.json(posts)
        }
      })
  })
}

module.exports.select = function(app, req, res) {
  const id = req.params.id
  app.server.models.post
    .findById(id)
    .populate('categories')
    .populate('coverImage', 'name _id uploadDate')
    .populate('images', 'name _id uploadDate')
    .populate('createdBy', 'name _id userName')
    .populate('logs.user', 'name _id userName')
    .exec(function (err, post) {
      if (err) {
        res.status(400).json(err)
      } else {
        res.json(post)
      }
    })
}

module.exports.selectBySlug = function(app, req, res) {
  const slug = req.params.slug
  app.server.models.post
    .findOne({slug: slug, deleted: false, published: true})
    .select(["-logs"])
    .populate('categories')
    .populate('coverImage', 'name _id uploadDate')
    .populate('images', 'name _id uploadDate')
    .populate('createdBy', 'name _id userName')
    .exec(function (err, post) {
      if (err) {
        res.status(400).json(err)
      } else {
        res.json(post)
      }
    })
}

module.exports.selectByCategory = function(app, req, res) {
  const perPage = 5;
  let page = Math.max(0, req.params.page) -1
  const categoryId = req.params.categoryId
  app.server.models.post
    .find({ categories: categoryId, deleted: false, published: true })
    .select(["-logs"])
    .populate('categories')
    .populate('coverImage', 'name _id uploadDate')
    .populate('images', 'name _id uploadDate')
    .populate('createdBy', 'name _id userName')
    .limit(perPage)
    .skip(perPage * page)
    .sort({
      creationDate: 'asc'
    })
    .exec(function (err, post) {
      if (err) {
        res.status(400).json(err)
      } else {
        res.json(post)
      }
    })
}

module.exports.selectLast = function(app, req, res) {
  const perPage = 5;
  let page = Math.max(0, req.params.page) -1
  let json = {}
  app.server.models.post
    .find({ deleted: false, published: true })
    .select(["-logs"])
    .populate('categories')
    .populate('coverImage', 'name _id uploadDate')
    .populate('images', 'name _id uploadDate')
    .populate('createdBy', 'name _id userName')
    .limit(perPage)
    .skip(perPage * page)
    .sort({
      creationDate: 'asc'
    })
    .exec(function (err, post) {
      if (err) {
        res.status(400).json(err)
      } else {
        if (post) {
          app.server.models.post.countDocuments({ deleted: false, published: true }, function(err, count) {
            if (err) {
              res.status(400).json(err)
            } else {
              json.post = post
              json.count = count
              res.json(json)
            }
          })
        } else {
          res.json(post)
        }
      }
    })
}

module.exports.insert = function(app, req, res) {
  const Post = app.server.models.post
  const post = new Post(req.body)
  app.server.models.user.findById(req.body.userId, function (err, user) {
    if (err) res.status(400).json(err)
    if (user && (user.permissions.isAdmin || user.permissions.createPosts)) {
      post.logs.push(newLog(user, 'Criação da postagem'))
      post.createdBy = user
      post.save(function(err, newPost) {
        if (err) res.status(400).json(err)
        newPost
          .populate('categories')
          .populate('coverImage', 'name _id uploadDate')
          .populate('images', 'name _id uploadDate')
          .populate('logs.user', 'name _id userName')
          .populate('createdBy', 'name _id userName', function(
            err,
            postPopulate
          ) {
            if (err) res.status(400).json(err)
            res.status(200).json(postPopulate)
          })
      })
    } else {
      res.status(400).json({ post: 'failed on insert' })
    }
  })
}

module.exports.update = function(app, req, res) {
  app.server.models.user.findById(req.body.userId, function(err, user) {
    if (err) res.status(400).json(err)
    if (user && (user.permissions.isAdmin || user.permissions.createPosts)) {
      app.server.models.post.findById(req.body._id, function(err, post) {
        if (err) res.status(400).json(err)
        const newPost = req.body
        newPost.logs = post.logs
        newPost.logs.push(newLog(user, 'Edição da postagem'))
        newPost.updateDate = new Date()
        newPost.deleted = false
        app.server.models.post
          .findOneAndUpdate({ _id: req.body._id }, newPost, { new: true })
          .populate('categories')
          .populate('coverImage', 'name _id uploadDate')
          .populate('images', 'name _id uploadDate')
          .populate('createdBy', 'name _id userName')
          .populate('logs.user', 'name _id userName')
          .exec(function(err, postUpdate) {
            if (err) res.status(400).json(err)
            res.json(postUpdate)
          })
      })
    } else {
      res.status(400).json({ post: 'failed on update' })
    }
  })
}

module.exports.delete = function(app, req, res) {
  app.server.models.user.findById(req.body.userId, function(err, user) {
    if (err) res.status(400).json(err)
    app.server.models.post.findById(req.params.id, function(err, post) {
      if (err) res.status(400).json(err)
      if (post.deleted) {
        if (user && user.permissions.isAdmin) {
          app.server.models.post.deleteOne({ _id: req.params.id }, function(
            err
          ) {
            if (err) res.status(400).json(err)
            res.json({ post: 'successfully removed' })
          })
        } else {
          res.status(400).json({ post: 'failed on remove' })
        }
      } else if (
        user &&
        (user.permissions.isAdmin || user.permissions.createPosts)
      ) {
        post.deleted = true
        post.published = false
        post.logs.push(newLog(user, 'Exclusão da postagem'))
        app.server.models.post.findOneAndUpdate(
          { _id: req.params.id },
          post,
          { new: true },
          function (err, postUpdate) {
            if (err) res.status(400).json(err)
            res.json(postUpdate)
          }
        )
      } else {
        res.status(400).json({ post: 'failed on move to recycle bin' })
      }
    })
  })
}
