const Router=require('express')
const router=new Router
const middlewareUser=require('./middleware/user')
const auctionController=require('./Router/authAuction')
const controllerLogin=require('./Router/authLogin')
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const verifyToken = require("./middleware/verify")
const Auction = require("./model/Auction")
const verifyTimerToken=require('./middleware/timeUser')

// const projectId = "commanding-ring-409619" // Get this from Google Cloud
// const keyFilename = "mykey.json" 
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
const multer = Multer({
	storage: Multer.memoryStorage(),
	limits: {
			fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
	},
});

var type = multer.single("img")
// const upload=require('./middleware/multer')
// const controlleraAuction=require('./Router/authAuction')
//authorization
router.post('/getuser',middlewareUser,controllerLogin.getUser)
router.post('/login', controllerLogin.login)
router.post('/registration',controllerLogin.registration)
router.post('/resendemail',controllerLogin.resendemail)
router.post('/registercreate',verifyTimerToken,controllerLogin.registerCreate)
router.get('/sendemail',verifyTimerToken,controllerLogin.SendEmail)
router.post('/editprofileimage',type,controllerLogin.editprofileimage)
router.post('/validatetoken',controllerLogin.validateToken)
router.post('/recoverypassword',controllerLogin.changeSendTokenPassword)
router.post('/getseller',middlewareUser,controllerLogin.getSeller)
router.post('/checktoken',middlewareUser,controllerLogin.checkToken)
router.post('/changepassword',controllerLogin.changePassword)

//aukction
router.get('/getauction',auctionController.getAuction)
router.post('/getauctionone',middlewareUser,auctionController.getAuctionOne)
router.post('/makebidauctionone',middlewareUser,auctionController.makeBidAuctionOne)
router.post('/getownauctions',middlewareUser,auctionController.getOwnAuctions)
router.post('/createauction',type,auctionController.createAuction)
router.post('/getauctioninfoforchange',auctionController.getInfoForChange)
router.post('/editfieldauction',middlewareUser,auctionController.changeInfoForChange)
router.post('/deleteauction',middlewareUser,auctionController.deleteAuction)
router.post('/deleteauctionsend',middlewareUser,auctionController.deleteAuctionSend)


module.exports = router