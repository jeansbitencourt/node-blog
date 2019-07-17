const bcrypt = require('bcryptjs')
const salts = 11

module.exports.list = function(app, req, res) {
  app.server.models.user.find(function (err, users) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.json(users)
    }
  })
}

module.exports.select = function (app, req, res) {
  const id = req.params.id
  app.server.models.user.findById(id, function(err, user) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.json(user)
    }
  })
}

module.exports.insert = function (app, req, res) {
  const User = app.server.models.user
  const user = new User(req.body)
  app.server.models.user.count({}, function(err, count) {
    if (err) res.status(400).json(err)
    if (count == 0) {
      user.permissions.isAdmin = true
      user.permissions.createPosts = true
      user.permissions.moderateComments = true
      user.permissions.banUsers = true
    } else {
      user.permissions.isAdmin = false
      user.permissions.createPosts = false
      user.moderateComments = false
      user.banUsers = false
    }
    bcrypt.hash(req.body.password, salts, function (err, hash) {
      if (err) {
        res.status(400).json(err)
      } else {
        user.password = hash
        user.save(function(err, newUser) {
          if (err) res.status(400).json(err)
          res.status(200).json(newUser)
        })
      }
    })
  })
}

module.exports.update = function (app, req, res) {
  app.server.models.user.findById(req.body.userId, function (err, user) {
    if (err) res.status(400).json(err)
    if (user && (user._id == req.params.id || user.permissions.isAdmin)) {
      const newUser = req.body
      bcrypt.hash(newUser.password, salts, function(err, hash) {
        if (err) {
          res.status(400).json(err)
        } else {
          newUser.password = hash
          app.server.models.user.findOneAndUpdate(
            { _id: req.body._id },
            newUser,
            { new: true },
            function(err, userUpdate) {
              if (err) res.status(400).json(err)
              res.json(userUpdate)
            }
          )
        }
      })
    } else {
      res.status(400).json({ user: 'failed on update' })
    }
  })
}

module.exports.delete = function (app, req, res) {
  app.server.models.user.findById(req.body.userId, function (err, user) {
    if (err) res.status(400).json(err)
    if (user && (user._id == req.params.id || user.permissions.isAdmin)) {
      app.server.models.user.findByIdAndRemove(req.params.id, function (err) {
        if (err) res.status(400).json(err)
        res.json({ user: 'successfully removed' })
      })
    } else {
      res.status(400).json({ user: 'failed on remove' })
    }
  })
}

module.exports.login = function (app, req, res) {
  const userName = req.body.userName
  const passWd = req.body.password
  app.server.models.user.findOne({ userName: userName }, function(err, user) {
    if (err) {
      res.status(400).json(err)
    } else if (user) {
      bcrypt.compare(passWd, user.password, function (err, valid) {
        if (err) {
          res.status(400).json(err)
        } else if (valid) {
          user.lastLogin = new Date()
          user.save(function(err) {
            if (err) console.log(err)
          })
          app.server.utils.auth.getNewAuth(user, res)
        } else {
          res.status(401).send({
            auth: false,
            message: 'Authentication failed. Incorrect password!'
          })
        }
      })
    } else {
      res.status(401).send({
        auth: false,
        message: 'Authentication failed. User not found!'
      })
    }
  })
}
