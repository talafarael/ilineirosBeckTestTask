import { time } from "console"

const Auction = require("../model/Auction")
const jwt = require("jsonwebtoken")
const {secret} = require("../config")
const User = require("../model/user")
interface Body {
	title: string
	time: string
	timeLive: number
	minRates: number
	desct: string
	token: string
}

class authAuction {
	async createAuction(req, res) {
		const {title, minRates, timeLive, desct, token}: Body = req.body
		var currentDate = new Date()
		if(timeLive>48){
			return res.status(400).json({
				message: "The allowable lifespan has been exceeded. Please specify a lifespan that does not exceed 48 hours."
				,
			})
		}
		if (timeLive == undefined) {
			return res.status(400).json({
							message: "Undefined variable 'timeLive' is not defined"
			});
}


		console.log(timeLive)

		var futureDate = new Date(
			currentDate.getTime() + timeLive * 60 * 60 * 1000
		)

		const decodedData = await jwt.verify(token, secret)
		const id = decodedData.id
		const user = await User.findOne({_id: id})
		if (!user) {
			return res.status(400).json({
				message: "The user with this name does not exist",
			})
		}

		const auction = new Auction({
			img: "",
			title: title,
			rates:'',
			desct: desct,
			minRates: minRates,
			timeEnd: futureDate,
   timeLive: timeLive,
			timeStart:currentDate,
			listRates: [],
			owner:id
		})
		await auction.save()

		res.status(200).json({
			success: true,
			message: "Auction created successfully",
		})
	}
}
module.exports = new authAuction()
