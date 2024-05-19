import {uploadFile} from "../s3"
const bcrypt = require("bcryptjs")
const {validationResult} = require("express-validator")
const User = require("../model/user")
const Preregister = require("../model/PreRegister")
const tempData = require("../cache")
const {Request, Response, NextFunction} = require("express")
const {secret,secretTime} = require("../config")
const timeUser = require("../middleware/timeUser")
const jwt = require("jsonwebtoken")
// const forgotdata = require('../email');
const Emailsend = require("../email")
const {json} = require("express")
const verifyToken = require("../middleware/verify")
const emailSender = new Emailsend()

const {Storage} = require("@google-cloud/storage")
const projectId = "commanding-ring-409619" // Get this from Google Cloud
const keyFilename = "mykey.json"
const generateToken = require("../middleware/generateAccessToken")
const generateAccessToken = (id) => {
	const playold = {
		id,
	}
	return jwt.sign(playold, secret, {expiresIn: "24h"})
}
// const generateAccessToken=require('../middleware/generateAccessToken')
// const storage = new Storage({
// 	projectId,
// 	keyFilename,
// })
// const bucket = storage.bucket("storageafarel")
class authController {
	async editprofileimage(req, res) {
		try {
			const {token} = req.body
			await uploadFile(req.file)

			const fileName = `https://faralaer.s3.eu-west-2.amazonaws.com/${req.file.originalname}`

			const {user, id} = await verifyToken(token, res)
			user.avatar = fileName

			await user.save()
			return res.status(200).json({message: "regis good"})
		} catch (e) {
			console.error(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async registration(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					message: "Error occurred during registration",
					errors,
				})
			}
			console.log(req.body)
			const {email, password, name} = req.body

			const candidate = await User.findOne({email})
			if (candidate) {
				return res.status(400).json({
					message: "The user with this email already exists",
				})
			}
			const checkName = await User.findOne({name: name})
			if (checkName) {
				return res.status(400).json({
					message: "The user with this name already exists",
				})
			}
			const hashPassword = await bcrypt.hash(password, 7)
			const chaecknum = Math.floor(Math.random() * 8999) + 1000
			const status = true

			const preregister = new Preregister({
				name: name,
				email: email,
				code: chaecknum,
				password: hashPassword,
				status: status,
			})
			preregister.save()
			const token = generateToken({
				id: preregister._id,
				secret:secretTime,
				time: "5min",
			})

			return res.status(200).json({token: token})
		} catch (e) {
			console.error(e)
			res.status(400).json({message: "Registration error"})
		}
	}

	async validateToken(req, res) {
		try {
			const {token} = req.body
			if (!token) {
				return res
					.status(403)
					.json({message: "Пользователь не авторизован"})
			}
			const decodedData = await jwt.verify(token, secret)
			if (!decodedData) {
				return res.status(400).json({
					message: "Is not valid token",
				})
			}
			const id = decodedData.id
			const user = await User.findById(id.trim())
			if (!user) {
				return res.status(400).json({
					message: "The user with this name does not exist",
				})
			}
			return res.status(200).json({message: "valid good"})
		} catch (error) {
			return res.status(401).json({
				message: "Invalid token",
			})
		}
	}
	async resendemail(req, res) {
		try {
			const savedData = tempData.getTempData("registrationData")
			const {email, name} = savedData

			const chaecknum = Math.floor(Math.random() * 8999) + 1000
			console.log(chaecknum)
			let status = false
			await emailSender.sendmessage({
				emailUser: email,
				num: chaecknum.toString(),
			})

		
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async SendEmail(req, res,next ) {
		try {
			const {preRegister,id} = req
			
			// if (!token) {
			// 	return res
			// 		.status(400)
			// 		.json({message: "Registration data not found"})
			// }

			
	
			if (preRegister.status) {
				await emailSender.sendmessage({
					emailUser: preRegister.email,
					num: preRegister.code.toString(),
				})

				preRegister.status = false
				preRegister.save()
			}

			return res.status(200).json({message: "Email sent successfully"})
		} catch (e) {
			console.error("There was an error sending the email:", e)
			return res.status(400).json({message: "Email sending error"})
		}
	}
	//  async sendEmailForgotPassword(req, res) {
	// 		try {
	// 						const { email } = req.body;
	// 						const username = email;
	// 						const candidate = await User.findOne({ username });
	// 						if (!candidate) {
	// 										return res
	// 														.status(400)
	// 														.json({ message: 'Ошибка при регистрации', errors });
	// 						}
	// 						const expiresIn = 1800;

	// 						const hashusername = jwt.sign({ username }, secret, {
	// 										expiresIn,
	// 						});

	// 						console.log('send '+hashusername);

	// 						const ffff = `${process.env.HOST}/acountforgot?token=${hashusername}`;
	// 						forgotdata.setTempData('email', { email }, 30 * 60 * 1000);
	// 						const em = forgotdata.getTempData('email');
	// 						await forgotEmailsend.sendmessage({
	// 										emailUser: em.email,
	// 										num: ffff.toString(),
	// 						});
	// 						console.log(em);
	// 						res.status(200).json({ message: 'em' });
	// 		} catch (e) {
	// 						console.log(e);
	// 						res.status(400).json({ message: 'Registration error' });
	// 		}
	// }
	async registerCreate(req, res) {
		try {
			
			const {code, } = req.body
		
			const {preRegister}=req

		
			if (preRegister.code == code) {
				const user = new User({
					avatar: "",
					name: preRegister.name,
					email: preRegister.email,
					password: preRegister.password,
					balance: 100,
					bidAuction: [],
					ownAuction: [],
				})
				await user.save()
				return res.status(200).json({
					message: "regist successfull",
				})
			}
		return res.status(400).json({message: "Invalid code"})
		} catch (error) {
			console.error("Error during registration:", error)
			return res.status(500).json({message: "Registration error"})
		}
	}
	async login(req, res) {
		try {
			const {email, password} = req.body
			const isEmail = email.includes("@")
			let user
			if (isEmail) {
				user = await User.findOne({email})
			} else {
				user = await User.findOne({name: email})
			}
			if (!user) {
				return res.status(400).json({
					message: "User with such name does not exist ",
				})
			}
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return res
					.status(400)
					.json({message: `The password entered is incorrect`})
			}
			const token = generateAccessToken(user._id)
			return res.status(200).json({
				token: token,
				balance: user.balance,
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async getPersonalAccount(req, res) {
		try {
			const {id} = req.body
			const {user}=req
			const userPerson = await User.findOne({_id: id})
		let info = {
				email:userPerson.email,
				name: userPerson.name,
				avatar: userPerson.avatar,
				ownAuction: userPerson.ownAuction,
			}
			let status=false
			if(user.id==userPerson._id){
				status=true
		 info = {
					balance: userPerson.balance,
				bidAuction: userPerson.bidAuction,
				ownAuction: userPerson.ownAuction,
					email:userPerson.email,
					name: userPerson.name,
					avatar: userPerson.avatar,
					ownAuction: userPerson.ownAuction,
				}
			}
			return res.status(200).json({
				status:status,
				info: info,
			})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async changeSendTokenPassword(req, res) {
		try {
			const {email} = req.body
			const user = await User.findOne({email: email})
			if (!user) {
				return res.status(404).json({message: "User not found"})
			}
			const token = generateAccessToken(user._id)
			await emailSender.sendmessage({
				emailUser: email,
				num: `https://il-auction-app.vercel.app/change/password?token=${token}`,
			})
			return res.status(200).json({status: true})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async checkToken(req, res) {
		try {
			const {token} = req.body
			const {user, id} = await verifyToken(token, res)
			return res.status(200).json({status: true})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async changePassword(req, res) {
		try {
			const {token, password} = req.body
			const {user, id} = await verifyToken(token, res)
			const hashPassword = await bcrypt.hash(password, 7)
			user.password = hashPassword
			await user.save()
			return res.status(200).json({message: "password change"})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async getUser(req, res) {
		try {
			const {token} = req.body
			const {user, id} = await verifyToken(token, res)
			const userInfo = {
				name: user.name,
				email: user.email,
				balance: user.balance,
				bidAuction: user.bidAuction,
				ownAuction: user.ownAuction,

				avatar: user.avatar,
			}

			return res.status(200).json({user: userInfo})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
}

module.exports = new authController()
