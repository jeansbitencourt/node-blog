module.exports = function(app){
    app.get('/api/images', function(req, res, next) {
        app.server.controllers.imageController.list(app, req, res);
    });

    app.get('/api/images/:id', function(req, res, next){
        app.server.controllers.imageController.select(app, req, res);
    });

    app.get('/api/images/data/:id', function(req, res, next){
        app.server.controllers.imageController.selectData(app, req, res);
    });

    app.use('/api/images', function (req, res, next) {
        app.server.utils.auth.verifyJWT(req, res, next);
    });

    app.post('/api/images', function(req, res, next){
        app.server.controllers.imageController.insert(app, req, res);
    });

    app.put('/api/images', function (req, res, next){
        app.server.controllers.imageController.update(app, req, res);
    });

    app.delete('/api/images/:id', function (req, res, next){
        app.server.controllers.imageController.delete(app, req, res);
    });
};