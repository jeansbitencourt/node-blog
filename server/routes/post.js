module.exports = function(app){
    app.get('/api/posts', function(req, res, next) {
        app.server.controllers.postController.list(app, req, res);
    });

    app.get('/api/posts/:id', function(req, res, next){
        app.server.controllers.postController.select(app, req, res);
    });

    app.use('/api/posts', function (req, res, next) {
        app.server.utils.auth.verifyJWT(req, res, next);
    });

    app.post('/api/posts', function(req, res, next){
        app.server.controllers.postController.insert(app, req, res);
    });

    app.put('/api/posts', function (req, res, next){
        app.server.controllers.postController.update(app, req, res);
    });

    app.delete('/api/posts/:id', function (req, res, next){
        app.server.controllers.postController.delete(app, req, res);
    });
};