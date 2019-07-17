module.exports = function(app) {
  app.post('/api/users', function(req, res, next) {
    app.server.controllers.userController.insert(app, req, res)
  })

  app.use('/api/users', function(req, res, next) {
    app.server.utils.auth.verifyJWT(req, res, next)
  })

  app.get('/api/users', function(req, res, next) {
    app.server.controllers.userController.list(app, req, res)
  })

  app.get('/api/users/:id', function(req, res, next) {
    app.server.controllers.userController.select(app, req, res)
  })

  app.put('/api/users', function(req, res, next) {
    app.server.controllers.userController.update(app, req, res)
  })

  app.delete('/api/users/:id', function(req, res, next) {
    app.server.controllers.userController.delete(app, req, res)
  })
}
