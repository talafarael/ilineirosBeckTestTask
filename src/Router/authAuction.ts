const Auction = require("../model/Auction")
const {secret} = require("../config")
const User = require("../model/user")
const verifyToken = require("../middleware/verify")
import express, {NextFunction, Request, Response} from "express"
import {uploadFile, getFileStream} from "../s3"
import { IUser } from "../type/mongoType"
import { IUserBid } from "../type/middlewareType"
import { calculateMinBet } from "../middleware/calculateMinBet"
const AuctionDelete = require("../model/Delet")
const checkUserOwner = require("../middleware/checkUserOwner")
const {Storage} = require("@google-cloud/storage")
const verifyTime = require("../middleware/timeMiddleware")
const projectId = "commanding-ring-409619" // Get this from Google Cloud
const keyFilename = "mykey.json"
const bcrypt = require("bcryptjs")
const Emailsend = require("../email")


const emailSender = new Emailsend()
const generateAccessToken = require("../middleware/generateAccessToken")
const PasswordSendDelete = require("../passwordSendDelete")
// const fs = require("fs")
// const util = require("util")
// const unlinkFile = util.promisify(fs.unlink)
const passwordSendDelete = new PasswordSendDelete()
// const storage = new Storage({
// 	projectId,
// 	keyFilename,
// })
// const bucket = storage.bucket("storageafarel")
class authAuction {
	async createAuction(req: any, res: Response) {
		try {
			// const file = req.file
			// const result = await uploadFile(file)
			if (!req.file) {
				return res.status(400).send("No file uploaded.")
			}

			console.log(req.file)
			await uploadFile(req.file)
			// 			const blobStream = blob.createWriteStream();

			// 			blobStream.on("finish", () => {
			// 					res.status(200).send("Success");
			// 					console.log("Success");
			// 			});
			// 			blobStream.end(req.file.buffer);

			// 			const file = req.files[0]
			// await unlinkFile(file.path)

			const fileName = `https://faralaer.s3.eu-west-2.amazonaws.com/${req.file.originalname}`

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
			console.log(user, id)
			const auction = new Auction({
				img: fileName,
				title: title,
				rates: minRates,
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
			const auction = await Auction.find()
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
			const {_id, token} = req.body
			const {user, id} = await verifyToken(token, res)

			let stateOwner = false
			const auction = await Auction.findOne({_id: _id})
			if (auction.owner == user.name) {
				stateOwner = true
			}
			const active = await verifyTime(auction.timeEnd, res)
			console.log(active)
			auction.active = active
			auction.save()
			res.status(200).json({
				stateOwner: stateOwner,

				auction: auction,
				message: "Auction created successfully",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}

	async makeBidAuctionOne(req: Request, res: Response, next:NextFunction) {
		try {
			const {sum, token, idAuction} = req.body
			if(sum<0){
				return res
				.status(400)
				.json({message: "the sum must be greater than zero"})
		  
			}
			const {user, id} = await verifyToken(token, res)
			const auction = await Auction.findOne({_id: idAuction})
			if (!auction) {
				return res
					.status(400)
					.json({message: "Auction does not exist."})
			}
			
	  
if(auction.listRates.length>0){
			if(auction.listRates[auction.listRates.length-1].userId==id){
				return res
				.status(400)
				.json({message: "you have already placed a bet, wait until it is interrupted"})
							}
						}
			let UserBid = auction.listRates.find((element:IUserBid) =>element.userId ==id);

			if(!UserBid){
				UserBid ={
					userId: '',
					sum: 0,
				}
			}else{
				let indexLastbBidUser = auction.listRates.findIndex((element:IUserBid) =>element.userId ==id );
				console.log(indexLastbBidUser)
				auction.listRates.splice(indexLastbBidUser , 1)
			}









const allSum=sum+UserBid.sum;

			// 	if(ten+Number(auction.rates)>+sum+UserBid.sum){
			// 		console.log(ten+Number(auction.rates))
			// 		return res.status(400).json({
			// 			message:
			// 				"sum must be higher 10% than now",
			// 		})
			// }
			 if(Number(auction.rates)>1000000){
			if(Number(auction.rates)*1.01>Number(allSum)){
				return res.status(400).json({
								message:
									"sum must be higher 1% than now",
							})
			}
		}else if(Number(auction.rates)>100000){
			console.log(auction.rates)
			if(Number(auction.rates)*1.05>+Number(allSum)){
				console.log(auction.rates*1.05)
				return res.status(400).json({
								message:
									"sum must be higher 5% than now",
							})
			}else if(Number(auction.rates)>10000){
				if(Number(auction.rates)*1.1>Number(allSum)){
					return res.status(400).json({
									message:
										"sum must be higher 10% than now",
								})
				}
		}
		}

console.log(allSum)
		console.log(auction.rates*1.05)








			
			if(Number(sum)>Number(user.balance)){
					return res.status(400).json({
					message:
						"If the sum is less than the minimum bid and less than the current bid, please make a higher bid",
				})
			}
				if (Number(sum)+Number(UserBid.sum) < +Number(auction.rates)) {
				return res.status(400).json({
					message:
						"If the sum is less than the minimum bid and less than the current bid, please make a higher bid",
				})
			}
	if(sum-UserBid.sum>Number(user.balance)){
		return res.status(400).json({
			message:
				"you dont have money ",
		})
	}
	
			const bid = {
				userId: id,
				sum: Number(sum)+Number(UserBid.sum),
			}
			auction.rates = Number(sum)+Number(UserBid.sum);
			auction.state = true
			auction.listRates.push(bid)

  if(auction.listRates[auction.listRates.length]>=2){
			console.log('arrr')
	const userEmail = await User.findOne({_id:auction.listRates[auction.listRates.length-2].userId})
console.log(userEmail)
			await emailSender.sendmessage({
				emailUser:userEmail.email,
					num:`вашу ставку перебил ${user.name}
					https://il-auction-app.vercel.app/${auction._id}
					`
				})
		}
		




			auction.save()
		if(sum!=0){
			console.log('aaaa')
			let indexBidUser = user.bidAuction.findIndex((element:IUserBid) =>element.userId ==id );
			user.bidAuction.splice(indexBidUser , 1)
		}
	 	user.bidAuction.push(auction._id)
			user.balance=user.balance-sum
			await user.save()
			res.status(200).json({
				auction: auction,
				message: "",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}

	async getOwnAuctions(req: Request, res: Response) {
		try {
			const {token} = req.body
			const {user, id} = await verifyToken(token, res)
			console.log(user)
			const ownAuctionIds = user.ownAuction
			console.log(ownAuctionIds)
			const auctions = await Auction.find({_id: {$in: ownAuctionIds}})

			const updates = auctions.map(async (element: any) => {
				const active = await verifyTime(element.timeEnd, res)
				element.active = active
				return element.save()
			})

			await Promise.all(updates)
			res.status(200).json({
				auctions: auctions,
				message: "",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async getInfoForChange(req: Request, res: Response) {
		try {
			const {token, _id} = req.body
			const {user, id} = await verifyToken(token, res)
			const checkOwner = await user.ownAuction.find(
				(auction: string) => auction == _id
			)
			if (!checkOwner) {
				return res.status(400).json({message: "your not owner"})
			}
			const auction = await Auction.find({_id: {$in: _id}})
			if (auction.minRates != auction.rates) {
				return res.status(400).json({message: "auction have bid"})
			}

			return res.status(200).json({
				title: auction.title,
				minRates: auction.minRates,
				endDate: auction.endDate,
				desc: auction.dec,
				message: "",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}

	async changeInfoForChange(req: Request, res: Response) {
		try {
			
			const {token, _id, title, minRates, timeEnd, desct} = req.body

			const {user, id} = await verifyToken(token, res)

			const Owner = await user.ownAuction
			const checkOwner = Owner.find((auction: string) => auction == _id)
			if (!checkOwner) {
				return res.status(400).json({message: "You are not owner"})
			}
			const auction = await Auction.find({_id: {$in: _id}})
			if (auction.minRates != auction.rates) {
				return res.status(400).json({message: "auction have bid"})
			}

			// verifyTime()
			if (title) {
				auction[0].title = title
			}
			if (minRates) {
				auction[0].rates = minRates
				auction[0].minRates = minRates
			}
			if (timeEnd) {
				auction[0].timeEnd = timeEnd
			}
			if (desct) {
				auction[0].desct = desct
			}
			console.log(auction)
			await auction[0].save()
			return res.status(200).json({
				auction,
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async deleteAuctionSend(req: Request, res: Response) {
		try {
			const {token, _id} = req.body
			const {user, id} = await verifyToken(token, res)
			const {checkOwner} = await checkUserOwner({res, user, _id})
			const passwordUser: number = Math.floor(Math.random() * 8999) + 1000
			const hashPassword = await bcrypt.hash(passwordUser.toString(), 7)
   await AuctionDelete.deleteOne({idUser: id,})
 

			await passwordSendDelete.sendmessage({
				emailUser: user.email,
				password: passwordUser.toString(),
			})

			const deleteAuction = new AuctionDelete({
				idUser: id,
				id: _id,
				password: hashPassword,
			})
			deleteAuction.save()
			res.status(200).json({
				message: "",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async deleteAuction(req: Request, res: Response) {
		try {
			const {token,password} = req.body
			const {user, id} = await verifyToken(token, res)
			
   const deleteAuction=await AuctionDelete.findOne({idUser: id,})
			if (!deleteAuction) {
				return res.status(400).json({ message: "Auction not found" });
    }
console.log(deleteAuction)
			const _id= deleteAuction.id
			const {checkOwner} = await checkUserOwner({res, user,_id})
			const validPassword = bcrypt.compareSync(password.toString(), deleteAuction.password)
			if (!validPassword) {
				return res
					.status(400)
					.json({message: `The password entered is incorrect`})
			}
			await Auction.deleteOne({_id: deleteAuction.id,})
			await AuctionDelete.deleteOne({idUser: id,})
			
			res.status(200).json({
				message: "",
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
}

module.exports = new authAuction()
