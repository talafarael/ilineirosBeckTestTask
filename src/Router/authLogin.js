const bcrypt = require("bcryptjs")
const {validationResult} = require("express-validator")
const User = require("../model/user")
const tempData = require("../cache")
const {Request, Response, NextFunction} = require("express")
const {secret} = require("../config")
const jwt = require("jsonwebtoken")
// const forgotdata = require('../email');
const Emailsend = require("../email")
const {json} = require("express")
const emailSender = new Emailsend()
const generateAccessToken = (id) => {
	const playold = {
		id,
	}
	return jwt.sign(playold, secret, {expiresIn: "24h"})
}
class authController {
	async registration(req, res) {
		try {
			console.log("1")
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({message: "Ошибка при регистрации", errors})
			}

			const {email, password} = req.body

			const candidate = await User.findOne({email})
			if (candidate) {
				return res.status(400).json({
					message: "Пользователь с таким именем уже существует",
				})
			}
			console.log("1")
			const hashPassword = await bcrypt.hash(password, 7)
			const chaecknum = Math.floor(Math.random() * 10000)
			const status = true
			tempData.setTempData(
				"registrationData",
				{email, chaecknum, hashPassword, status},
				30 * 60 * 1000
			)

			return res.status(200).json({message: "regis good"})
		} catch (e) {
			console.error(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async resendemail(req, res) {
		try {
			const savedData = tempData.getTempData("registrationData")
			const email = savedData.email

			const chaecknum = Math.floor(Math.random() * 10000)
			let status = false
			await emailSender.sendmessage({
				emailUser: email,
				num: chaecknum.toString(),
			})

			tempData.setTempData(
				"registrationData",
				{
					email,
					chaecknum,
					hashPassword: savedData.hashPassword,
					status,
				},
				30 * 60 * 1000
			)
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
	async SendEmail(req, res) {
		try {
			const savedData = tempData.getTempData("registrationData")

			if (!savedData) {
				return res
					.status(400)
					.json({message: "Registration data not found"})
			}

			const email = savedData.email
			const chaecknum = savedData.chaecknum
			let status = savedData.status
			if (status) {
				await emailSender.sendmessage({
					emailUser: email,
					num: chaecknum.toString(),
				})

				status = false
				tempData.setTempData(
					"registrationData",
					{
						email,
						chaecknum,
						hashPassword: savedData.hashPassword,
						status,
					},
					30 * 60 * 1000
				)

				return res
					.status(200)
					.json({message: "Email sent successfully"})
			}
		} catch (e) {
			console.error("Ошибка при отправке email:", e)
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
			const savedData = tempData.getTempData("registrationData")
			const {code} = req.body

			if (!savedData) {
				return res
					.status(400)
					.json({message: "Registration data not found"})
			}

			const {email, chaecknum, hashPassword, status} = savedData
			if (chaecknum == code) {
				const user = new User({
					email:email,
					password: hashPassword,
					balance: 100,
				})
				await user.save()
				return res.status(200).json({
					message: "regist successfull",
				})
			}
			tempData.setTempData(
				"registrationData",
				{
					email,
					chaecknum,
					hashPassword,
					status,
				},
				30 * 60 * 1000
			)
			return res.status(400).json({message: "Invalid code"})
		} catch (error) {
			console.error("Error during registration:", error)
			return res.status(500).json({message: "Registration error"})
		}
	}
	async login(req, res) {
		try {
			const {email, password} = req.body
			const user = await User.findOne({email})
			if (!user) {
				return res.status(400).json({
					message: "Пользователь с таким именем не существует ",
				})
			}
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return res.status(400).json({message: `Введен неверный пароль`})
			}
			const token = generateAccessToken(user._id)
			res.cookie("token", token, {
				httpOnly: true,
				maxAge: 86400 * 1000,
			})
			return res.status(200).json({message: "All ok"})
		} catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}
}

module.exports = new authController()
