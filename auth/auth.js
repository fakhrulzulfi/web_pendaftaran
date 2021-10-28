const jwt = require('jsonwebtoken');

const TOKEN_SECRET = 'hadehhhhh';

const generateAccessToken = ({username, userId}) => {
    const assignJwt = jwt.sign({username, userId}, TOKEN_SECRET, { expiresIn: '12h' });

    return assignJwt;
};

const authenticateToken = (token) => {
    try {
        const decodeToken = jwt.verify(token, TOKEN_SECRET);

        return decodeToken;
    } catch (error) {
        return undefined;
    }
};

module.exports = {generateAccessToken, authenticateToken};