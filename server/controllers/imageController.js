const fs = require('node-fs');

module.exports.list = function(app, req, res){
    app.server.models.image.find(function(err, images){
        if(err){
            res.status(400).json(err);
        }else{
            res.json(images);
        }
    });
}

module.exports.select = function(app, req, res){
    let id = req.params.id;
    app.server.models.image.findById(id, function(err, image){
        if(err){
            res.status(400).json(err);
        }else{
            res.json(image);
        }
    });
}

module.exports.selectData = function(app, req, res){
    let id = req.params.id;
    app.server.models.image.findById(id, function(err, image){
        if(err){
            res.status(400).json(err);
        }else{
            res.contentType(image.contentType);
            res.send(image.data);
        }
    });
}

module.exports.insert = function(app, req, res){
    let Image = app.server.models.image;
    let image = new Image();
    app.server.models.user.findById(req.body.userId, function(err, user){
        if(err) res.status(400).json(err);
        if(user && (user.permissions.isAdmin || user.permissions.createPosts)){
            console.log(req.files);
            fs.readFile(req.files.file.path, function(err, data){
                if(err) res.status(400).json(err);
                if(data){
                    image.name = req.body.name;
                    image.data = data;
                    image.contentType = 'image/png';
                    image.save(function(err, newImage){
                        if(err) res.status(400).json(err);
                        res.json(newImage);
                    });
                }else{
                    res.status(400).json({'image': 'failed on read file'});
                }
            });
        }else{
            res.status(400).json({'image': 'failed on insert'})
        }
    });
}

module.exports.update = function(app, req, res){
    app.server.models.user.findById(req.body.userId, function(err, user){
        if(err) res.status(400).json(err);
        if(user && (user.permissions.isAdmin || user.permissions.createPosts)){
            let newImage = req.body;
            app.server.models.image.findOneAndUpdate({ _id: req.body._id}, newImage, { new: true }, function(err, imageUpdate) {
                if(err) res.status(400).json(err);
                res.json(imageUpdate);
            });
        }else{
            res.status(400).json({'image': 'failed on update'})
        }
    });
}

module.exports.delete = function(app, req, res){
    app.server.models.user.findById(req.body.userId, function(err, user){
        if(err) res.status(400).json(err);
        if(user && (user.permissions.isAdmin || user.permissions.createPosts)){
            app.server.models.image.findByIdAndRemove(req.params.id, function(err){
                if(err) res.status(400).json(err);
                res.json({'category': 'successfully removed'});
            });
        }else{
            res.status(400).json({'user': 'failed on remove'});
        }
    });
}