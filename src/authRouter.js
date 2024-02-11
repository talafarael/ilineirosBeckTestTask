const Router=require('express')
const router=new Router
const middlewareUser=require('./middleware/user')
const auctionController=require('./Router/authAuction')
const controllerLogin=require('./Router/authLogin')
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const verifyToken = require("./middleware/verify")
const Auction = require("./model/Auction")
const projectId = "commanding-ring-409619" // Get this from Google Cloud
const keyFilename = "mykey.json" 

const multer = Multer({
	storage: Multer.memoryStorage(),
	limits: {
			fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
	},
});
const storage = new Storage({
	projectId,
	keyFilename,
})
const bucket = storage.bucket("storageafarel")
var type = multer.single("image")
// const upload=require('./middleware/multer')
// const controlleraAuction=require('./Router/authAuction')
//authorization
router.post('/login', controllerLogin.login)
router.post('/registration',controllerLogin.registration)
router.post('/resendemail',controllerLogin.resendemail)
router.post('/registercreate',controllerLogin.registerCreate)
router.get('/sendemail',controllerLogin.SendEmail)
//aukction
router.get('/getauction',auctionController.getAuction)

router.post('/getauctionone',auctionController.getAuctionOne)
router.post('/makebidauctionone',auctionController.makeBidAuctionOne)


router.post('/createauction',type,async(req, res)=> {
	try {
		if (req.file) {
			console.log("File found, trying to upload...");
			// const fileName = `${Date.now()}-${file.originalname}`
			// 	const fileUrl = `https://storage.googleapis.com/storageafarel/${fileName}`
			const blob = bucket.file(req.file.originalname);
			const blobStream = blob.createWriteStream();
	  
			blobStream.on("finish", () => {
				
			  console.log("Success");
			});
			
			blobStream.end(req.file.buffer);
			
		  } 
		const fileName=`https://storage.cloud.google.com/storageafarel/${req.file.originalname}`
		// File is available as req.file

		// const blob = bucket.file(req.file.originalname);
		// const blobStream = blob.createWriteStream();

		// blobStream.on("finish", () => {
		// 		res.status(200).send("Success");
		// 		console.log("Success");
		// });
		// blobStream.end(req.file.buffer);


		// const fileUrl = `https://storage.googleapis.com/storageafarel/${fileName}`
		const {title, minRates, endDate, desc, token} = req.body
		// console.log(title, minRates, endDate, desc, token)
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
			img: fileName,
			title: title,
			rates: minRates,
			state: false,
			desct: desc,
			minRates: minRates,
			timeEnd: endDate[0],
			active: true,
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
})




module.exports = router