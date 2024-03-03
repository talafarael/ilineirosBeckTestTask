const Auction = require("../model/Auction")
import jwt, {JwtPayload} from "jsonwebtoken"
const {secret} = require("../config")
const User = require("../model/user")
const verifyToken = require("../middleware/verify")
import express, {Request, Response} from "express"
const {Storage} = require("@google-cloud/storage")

const projectId = "commanding-ring-409619" // Get this from Google Cloud
const keyFilename = "mykey.json"

const storage = new Storage({
	projectId,
	keyFilename,
})
const bucket = storage.bucket("storageafarel")
class authAuction {
	async createAuction(req, res: Respons) {
		try {
			if (!req.file) {
				return res.status(400).json({
					message: "Not all fields are filled in, please try again",
				})
			}
			if (req.file) {
				console.log("File found, trying to upload...")

				const blob = bucket.file(req.file.originalname)
				const blobStream = blob.createWriteStream()

				blobStream.on("finish", () => {
					console.log("Success")
				})

				blobStream.end(req.file.buffer)
			}

			const fileName = `https://storage.googleapis.com/storageafarel/${req.file.originalname}`

			const {title, minRates, endDate, desc, token} = req.body
			if (!title || !minRates || !endDate || !desc || !token) {
				return res
					.status(400)
					.json({message: "All fields are required"})
			}
			if (endDate == undefined) {
				return res.status(400).json({
					message: "Undefined variable 'timeLive' is not defined",
				})
			}

			var currentDate = new Date()

			const {user, id} = await verifyToken(token, res)

			const auction = new Auction({
				img: fileName,
				title: title,
				rates: minRates,
				state: false,
				desct: desc,
				minRates: minRates,
				timeEnd: endDate,
				active: true,
				timeStart: currentDate,
				listRates: [],
				owner: user.name,
				ownerId: id,
			})
			user.ownAuction.push(auction._id)

			user.save()
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
	// async createAuction(req, res: Response) {
	// 	try {
	// 		if (!req.file) {
	// 			return res.status(400).send("No file uploaded.")
	// 		}

	// 		// File is available as req.file
	// 		console.log(req.file)
	// 		// const blob = bucket.file(req.file.originalname);
	// 		// const blobStream = blob.createWriteStream();

	// 		// blobStream.on("finish", () => {
	// 		// 		res.status(200).send("Success");
	// 		// 		console.log("Success");
	// 		// });
	// 		// blobStream.end(req.file.buffer);

	// 		const file = req.files[0]
	// 		console.log(file)
	// 		// const fileUrl = `https://storage.googleapis.com/storageafarel/${fileName}`
	// 		const {title, minRates, endDate, desc, token} = req.body
	// 		// console.log(title, minRates, endDate, desc, token)
	// 		if (endDate == undefined) {
	// 			return res.status(400).json({
	// 				message: "Undefined variable 'timeLive' is not defined",
	// 			})
	// 		}

	// 		var currentDate = new Date()
	// 		// const	date=timeEnd-currentDate
	// 		// var days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
	// 		// var hours = Math.floor(
	// 		// 	(milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	// 		// )
	// 		// var minutes = Math.floor(
	// 		// 	(milliseconds % (1000 * 60 * 60)) / (1000 * 60)
	// 		// )
	// 		// var seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

	// 		// var futureDate = new Date(
	// 		// 	currentDate.getTime() + timeLive * 60 * 60 * 1000
	// 		// )

	// 		const {user, id} = await verifyToken(token, res)

	// 		const auction = new Auction({
	// 			img: "",
	// 			title: title,
	// 			rates: minRates,
	// 			state: false,
	// 			desct: desc,
	// 			minRates: minRates,
	// 			timeEnd: endDate[0],
	// 			active: true,
	// 			timeStart: currentDate,
	// 			listRates: [],
	// 			owner: id,
	// 		})
	// 		await auction.save()

	// 		res.status(200).json({
	// 			success: true,
	// 			message: "Auction created successfully",

	// 		})
	// 	} catch (e) {
	// 		console.log(e)
	// 		res.status(400).json({message: "Registration error"})
	// 	}
	// }
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
			console.log(id)
			console.log(req.body)
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
	async getOwnAuction(req: Request, res: Response) {
		try {
			const {token} = req.body
			const {user, id} = await verifyToken(token, res)
			console.log(user)
			const ownAuctionIds = user.ownAuction
			console.log(ownAuctionIds)
			const auctions = await Auction.find({_id: {$in: ownAuctionIds}})
			res.status(200).json({
				auction: auctions,
				message: "",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
async	getInfoForChange(req: Request, res: Response) {
		try {
			const {token ,_id}=req.body
			const {user, id} = await verifyToken(token, res)
			const checkOwner=user.ownAuction.find((auction:string) => auction == _id)
			if(!checkOwner){
			return	res.status(400).json({message: "your not owner"})
			}
			const auction=Auction.find({_id: {$in: _id}})
			if(auction.minRates!=auction.rates){
				return	res.status(400).json({message: "auction have bid"})
			}
			return res.status(200).json({
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
