module.exports.list = function(app, req, res) {
  app.server.models.post
    .find({})
    .populate('categories')
    .populate('images')
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
    .populate('images')
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
      post.save(function(err, newPost) {
        if (err) res.status(400).json(err)
        res.status(200).json(newPost)
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
      const newPost = req.body
      app.server.models.post.findOneAndUpdate(
        { _id: req.body._id },
        newPost,
        { new: true },
        function (err, postUpdate) {
          if (err) res.status(400).json(err)
          res.json(postUpdate)
        }
      )
    } else {
      res.status(400).json({ post: 'failed on update' })
    }
  })
}

module.exports.delete = function(app, req, res) {
  app.server.models.user.findById(req.body.userId, function(err, user) {
    if (err) res.status(400).json(err)
    if (user && (user.permissions.isAdmin || user.permissions.createPosts)) {
      app.server.models.post.findByIdAndRemove(req.params.id, function(err) {
        if (err) res.status(400).json(err)
        res.json({ post: 'successfully removed' })
      })
    } else {
      res.status(400).json({ post: 'failed on remove' })
    }
  })
}
