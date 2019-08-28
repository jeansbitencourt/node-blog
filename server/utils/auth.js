require('dotenv-safe').load()
const jwt = require('jsonwebtoken')

module.exports.verifyJWT = function(req, res, next) {
  const token = req.headers['x-access-token']
  if (!token) {
    return res.status(401).send({
      auth: false,
      message: 'No token provided.'
    })
  }

  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    const now = Date.now().valueOf() / 1000
    if (typeof decoded !== 'undefined' && typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      return res.status(500).send({
        auth: false,
        message: 'Token expired.'
      })
    }
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      })
    }

    // se tudo estiver ok, salvar id do usuario no req
    req.body.userId = decoded.id
    next()
  })
}

module.exports.getNewAuth = function(user, res) {
  const id = user._id
  const token = jwt.sign(
    {
      id
    },
    process.env.SECRET,
    {
      expiresIn: 18000 // expires in 5h
    }
  )
  const us = JSON.parse(JSON.stringify(user))
  delete us.password
  res.status(200).send({
    auth: true,
    token: token,
    user: us
  })
}

