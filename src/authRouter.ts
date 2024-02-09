const Router=require('express')
const router=new Router
const middlewareUser=require('./middleware/user')
const auctionController=require('./Router/authAuction')
const controllerLogin=require('./Router/authLogin')
// const upload=require('./middleware/multer')
// const controlleraAuction=require('./Router/authAuction')
//authorization
router.post('/login', controllerLogin.login)
router.post('/registration',controllerLogin.registration)
router.post('/resendemail',controllerLogin.resendemail)
router.post('/registercreate',controllerLogin.registerCreate)
router.get('/sendemail',controllerLogin.SendEmail)
//aukction
router.post('/createauction',middlewareUser,auctionController.createAuction)







module.exports = router