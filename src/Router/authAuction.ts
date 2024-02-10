const Auction = require("../model/Auction")
import jwt, {JwtPayload} from "jsonwebtoken"
const {secret} = require("../config")
const User = require("../model/user")
const verifyToken = require("../middleware/verify")
import express, {Express, Request, Response} from "express"


class authAuction {
	async createAuction(req: Request, res: Response) {
		try {
console.log(req.body)
			const {title, minRates, endDate, desc, token} = req.body
			console.log(title, minRates, endDate, desc, token)
			if (endDate == undefined) {
				return res.status(400).json({
					message: "Undefined variable 'timeLive' is not defined",
				})
			}

			var currentDate = new Date()
			// const	date=timeEnd-currentDate
			// var days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
			// var hours = Math.floor(
			// 	(milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			// )
			// var minutes = Math.floor(
			// 	(milliseconds % (1000 * 60 * 60)) / (1000 * 60)
			// )
			// var seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

			// var futureDate = new Date(
			// 	currentDate.getTime() + timeLive * 60 * 60 * 1000
			// )

			const {user, id} = await verifyToken(token, res)

			const auction = new Auction({
				img: "",
				title: title,
				rates: minRates,
				state: false,
				desct: desc,
				minRates: minRates,
				timeEnd: endDate[0],
				active:true,
				timeStart: currentDate,
				listRates: [],
				owner: id,
			})
			await auction.save()

			res.status(200).json({
				success: true,
				message: "Auction created successfully",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async getAuction(req: Request, res: Response) {
		try {
			const auction = await Auction.find().limit(20)
			res.status(200).json({
				auction: auction,
				message: "Auction created successfully",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async getAuctionOne(req: Request, res: Response) {
		try {
			const {id} = req.body
			const auction = await Auction.findOne({_id: id})
			res.status(200).json({
				auction: auction,
				message: "Auction created successfully",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async deleteAuctionOne(req: Request, res: Response) {
		try {
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}

	async makeBidAuctionOne(req: Request, res: Response) {
		try {
			const {sum, token, idAuction} = req.body
			const auction = await Auction.findOne({_id: idAuction})
			if (!auction) {
				return res
					.status(400)
					.json({message: "Auction does not exist."})
			}
			const {user, id} = await verifyToken(token, res)
			if (sum < auction.minRates && sum < auction.rates) {
				return res.status(400).json({
					message:
						"If the sum is less than the minimum bid and less than the current bid, please make a higher bid",
				})
			}
			const bid = {
				userId: id,
				sum: sum,
			}
			auction.rates = sum
			auction.state = true
			auction.listRates.push(bid)
			auction.save()
			res.status(200).json({
				auction: auction,
				message: "",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
}
module.exports = new authAuction()
