import jwt, {JwtPayload} from "jsonwebtoken"
import { Response} from "express"
const PreRegister = require("../model/PreRegister")

interface IVerifyToken {
	token: string
	res: Response
	secret: string
}
async function verifyToken({token, res, secret}: IVerifyToken) {
	try {
		console.log('aaa')
		if (!token) {
			return res
				.status(403)
				.json({message: "Пользователь не авторизован"})
		}
		console.log(secret)
		console.log(token)

		const decodedData = (await jwt.verify(token, secret)) as JwtPayload
		const id = decodedData.id
	
		const preRegister = await PreRegister.findById(id.trim())
		if (!preRegister ) {
			return res.status(400).json({
				message: "The user with this name does not exist",
			})
		}
		return {preRegister , id}
	} catch (error) {
		return res.status(401).json({
			message: "Invalid token",
		})
	}
}

module.exports = verifyToken
