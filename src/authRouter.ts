const Router=require('express')
const router=new Router
const middlewareUser=require('./middleware/user')
const auctionController=require('./Router/authAuction')
const controllerLogin=require('./Router/authLogin')
const { Storage } = require("@google-cloud/storage");
const multer = require('multer');



const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
					fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
	},
});



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
router.post('/createauction',upload.single("img"),auctionController.createAuction)
router.post('/getauctionone',auctionController.getAuctionOne)
router.post('/makebidauctionone',auctionController.makeBidAuctionOne)







module.exports = router