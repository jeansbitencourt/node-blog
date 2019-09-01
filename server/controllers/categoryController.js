module.exports.list = function(app, req, res) {
  app.server.models.category.find(function(err, categories) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.json(categories)
    }
  })
}

module.exports.select = function(app, req, res) {
  const id = req.params.id
  app.server.models.category.findById(id, function(err, category) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.json(category)
    }
  })
}

module.exports.insert = function(app, req, res) {
  const Category = app.server.models.category
  const category = new Category(req.body)
  app.server.models.user.findById(req.body.userId, function (err, user) {
    if (err) res.status(400).json(err)
    if (user && user.permissions.isAdmin) {
      category.save(function(err, newCategory) {
        if (err) res.status(400).json(err)
        res.status(200).json(newCategory)
      })
    } else {
      res.status(400).json({
        category: 'failed on insert'
      })
    }
  })
}

module.exports.update = function(app, req, res) {
  app.server.models.user.findById(req.body.userId, function(err, user) {
    if (err) res.status(400).json(err)
    if (user && user.permissions.isAdmin) {
      const newCategory = req.body
      app.server.models.category.findOneAndUpdate({
          _id: req.body._id
        },
        newCategory, {
          new: true
        },
        function(err, categoryUpdate) {
          if (err) res.status(400).json(err)
          res.json(categoryUpdate)
        }
      )
    } else {
      res.status(400).json({
        category: 'failed on update'
      })
    }
  })
}

module.exports.delete = function(app, req, res) {
  app.server.models.user.findById(req.body.userId, function(err, user) {
    if (err) res.status(400).json(err)
    if (user && user.permissions.isAdmin) {
      app.server.models.category.findByIdAndRemove(req.params.id, function(err) {
        if (err) res.status(400).json(err)
        res.json({
          category: 'successfully removed'
        })
      })
    } else {
      res.status(400).json({
        user: 'failed on remove'
      })
    }
  })
}