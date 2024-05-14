const jwt = require("jsonwebtoken");

interface IgenerateAccessToken {
    id: string;
    secret: string;
    time: string;
}

const generateAccessToken = ({ id, secret, time }: IgenerateAccessToken) => {
    const payload = {
        id,
    };
    console.log(id)
    return jwt.sign(payload, secret, { expiresIn: time });
}

module.exports = generateAccessToken;