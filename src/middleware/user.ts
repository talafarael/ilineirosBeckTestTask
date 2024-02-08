const jwt = require("jsonwebtoken")
const {secret} = require("../config")

module.exports = function (req: Request, res: Response, next: Function) {


	try {
		const {token}:{ token: string } = req.body
		if (!token) {
			return res
				.status(403)
				.json({message: "Пользователь не авторизован"})
		}
		const decodedData = jwt.verify(token, secret)
		req.user = decodedData

		next()
	} catch (e) {
		console.log(e)
		return res.status(403).json({message: "Пользователь не авторизован"})
	}
}
