newLog = function(user, action) {
  return {
    user: user,
    action: action
  }
}

module.exports.list = function(app, req, res) {
  app.server.models.post
    .find({})
    .populate('categories')
    .populate('coverImage')
    .populate('images')
    .populate('createdBy', 'name _id userName')
    .populate('logs.user', 'name _id userName')
    .exec(function(err, posts) {
      if (err) {
        res.status(400).json(err)
      } else {
        res.json(posts)
      }
    })
}

module.exports.select = function(app, req, res) {
  const id = req.params.id
  app.server.models.post
    .findById(id)
    .populate('categories')
    .populate('coverImage')
    .populate('images')
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
          .populate('coverImage')
          .populate('images')
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
        app.server.models.post
          .findOneAndUpdate({ _id: req.body._id }, newPost, { new: true })
          .populate('categories')
          .populate('coverImage')
          .populate('images')
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
