import jwt from 'jsonwebtoken';
exports.signJWT = async(data) => {
    return new Promise((resolve, reject) => {
        try {
            let token = jwt.sign(data, "jwtKeySecret");
            return resolve(token);
        } catch (err) {
            return reject(err);
        }
    });
};

exports.decode = async(token) => {
    return new Promise((resolve, reject) => {
        try {
            let decoded = jwt.verify(token, "jwtKeySecret");
            return resolve(decoded);
        } catch (err) {
            return reject(err);
        }
    });
};
