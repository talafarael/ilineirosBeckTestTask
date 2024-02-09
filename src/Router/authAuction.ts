const Auction = require("../model/Auction")
const jwt = require("jsonwebtoken")
const {secret} = require("../config")
const User = require("../model/user")
interface Body {
	name: string
	time: string
	timeLive: number
	rates: number
	value: string
	token: string
}

class authAuction {
	async createAuction(req, res) {
		const {name, time, rates, timeLive, value, token}: Body = req.body


		const decodedData = await jwt.verify(token, secret)
		const id = decodedData.id
		const user = await User.findOne({_id:id})
			if (!user) {
				return res.status(400).json({
					message: "Пользователь с таким именем не существует ",
				})
			}

		const auction = new Auction({
			img: "",
			name: name,
			value: value,
			rates: rates,
			time:time,
			timeLive: timeLive,
			listRates: [],
		})
		await auction.save()

		res.status(200).json({
			success: true,
			message: "Auction created successfully",
		})
	}
}
module.exports = new authAuction()
