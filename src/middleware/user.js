const jwt = require("jsonwebtoken")
const {secret} = require("../config")

module.exports = function (req, res, next) {


	try {
		const {token} = req.body
		if (!token) {
			return res
				.status(403)
				.json({message: "Пользователь не авторизован"})
		}
		const decodedData = jwt.verify(token, secret)
		console.log(decodedData)
		req.user = decodedData

		next()
	} catch (e) {
		console.log(e)
		return res.status(403).json({message: "Пользовательааа не авторизован"})
	}
}
