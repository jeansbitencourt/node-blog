module.exports = function(app) {
  app.get('/api/categories', function(req, res, next) {
    app.server.controllers.categoryController.list(app, req, res)
  })

  app.get('/api/categories/:id', function(req, res, next) {
    app.server.controllers.categoryController.select(app, req, res)
  })

  app.use('/api/categories', function(req, res, next) {
    app.server.utils.auth.verifyJWT(req, res, next)
  })

  app.post('/api/categories', function(req, res, next) {
    app.server.controllers.categoryController.insert(app, req, res)
  })

  app.put('/api/categories', function(req, res, next) {
    app.server.controllers.categoryController.update(app, req, res)
  })

  app.delete('/api/categories/:id', function(req, res, next) {
    app.server.controllers.categoryController.delete(app, req, res)
  })
}
