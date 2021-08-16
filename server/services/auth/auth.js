const jwt = require('./jwt');
const lastLogin = require('./lastLogin')

exports.authenticateJWT = async (req, res, next) => {
    try {
        var date = await Date.now();
        if (req.headers.token !== undefined && req.headers.token !== 'undefined') {
            var token = req.headers.token;
            var decoded = await jwt.decode(token);
            if (decoded.uid === undefined || decoded.uid === '')
            {throw { status: 401, message: 'Request unauthenticated' };}
                req.userId = decoded.uid;
                req.role = decoded.t;
                lastLogin.lastLoginUpdate(req.userId)

                next();
        } else
        {throw { status: 401, message: 'Request unauthenticated' };}
    } catch (err) {
        next(err);
    }
};