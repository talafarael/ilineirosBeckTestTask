import jwt, {JwtPayload} from "jsonwebtoken"
import {Response} from "express"
const PreRegister = require("../model/PreRegister")
const {secretTime} = require("../config")

// interface IBody {
// 	query: {
// 		token?: string
// 	}
// 	preRegister?: any
// 	id?: string
// }
// interface IVerifyToken {
// 	req: IBody
// 	res: Response

// 	next: any
// }
module.exports = async function (req, res, next) {
	try {
		console.log(req.query)
		let token = req.query.token
		console.log(token)
		if (!token) {
			return res.send({message: "Пользователь не авторизован"})
		}

		const decodedData = await jwt.verify(token, secretTime)
		if (!decodedData) {
			res.status(400).send({
				error: "Order id is invalid",
			})
			return
		}
		console.log("ddd")
		const id = decodedData.id

		const preRegister = await PreRegister.findById(id.trim())
		if (!preRegister) {
			return res.status(400).json({
				message: "The user with this name does not exist",
			})
		}
		req.preRegister = preRegister
		req.id = id
		next()
	} catch (error) {
		return res.status(401).json({
			message: "Invalid token",
		})
	}
}
