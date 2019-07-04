module.exports.list = function(app, req, res){
    app.server.models.category.find(function(err, categories){
        if(err){
            res.status(400).json(err);
        }else{
            res.json(categories);
        }
    });
}

module.exports.select = function(app, req, res){
    let id = req.params.id;
    app.server.models.category.findById(id, function(err, category){
        if(err){
            res.status(400).json(err);
        }else{
            res.json(category);
        }
    });
}

module.exports.insert = function(app, req, res){
    let Category = app.models.category;
    let category = new Category(req.body);
    app.server.models.user.findById(req.body.userId, function(err, user){
        if(err) res.status(400).json(err);
        if(user && user.permissions.isAdmin){
            category.save(function(err, newCategory){
                if(err)
                    res.status(400).json(err);
                res.status(200).json(newCategory);
            });
        }else{
            res.status(400).json({'category': 'failed on insert'});
        }
    });
}

module.exports.update = function(app, req, res){
    app.server.models.user.findById(req.body.userId, function(err, user){
        if(err) res.status(400).json(err);
        if(user && user.permissions.isAdmin){
            let newCategory = req.body;
            app.models.category.findOneAndUpdate({ _id: req.body._id}, newCategory, { new: true }, function(err, categoryUpdate) {
                if(err) res.status(400).json(err);
                res.json(categoryUpdate);
            });
        }else{
            res.status(400).json({'category': 'failed on update'});
        }
    });
}

module.exports.delete = function(app, req, res){
    app.server.models.user.findById(req.body.userId, function(err, user){
        if(err) res.status(400).json(err);
        if(user && user.permissions.isAdmin){
            app.models.category.findByIdAndRemove(req.body._id, function(err){
                if(err) res.status(400).json(err);
                res.json({'category': 'successfully removed'});
            });
        }else{
            res.status(400).json({'user': 'failed on remove'});
        }
    });
}