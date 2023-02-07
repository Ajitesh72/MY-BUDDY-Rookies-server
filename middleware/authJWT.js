const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.Jwtsecretkey , (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            // console.log(user)
            next();
            // res.send(user)
            // console.log(res.data)
        });
    } else {
        res.sendStatus(401);
        // console.log(res.data())
    }
  };

module.exports = authenticateJWT