const jwt = require("jsonwebtoken")
const {secret} = require("../config")
const generateAccessToken = (id:string) => {
	const playold = {
		id,
	}
	return jwt.sign(playold, secret, {expiresIn: "24h"})
}
exports.module=generateAccessToken