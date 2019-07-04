require("dotenv-safe").load();
var jwt = require('jsonwebtoken');

module.exports.verifyJWT = function (req, res, next){
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.body.userId = decoded.id;
      next();
    });
}

module.exports.getNewAuth = function(user, res){
    const id = user._id;
    var token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 900 // expires in 15 min
    });
    res.status(200).send({ auth: true, token: token });
}