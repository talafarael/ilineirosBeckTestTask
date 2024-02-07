const Router=require('express')
const router=new Router
const controller=require('./Router/authLogin')
//authorization
router.post('/login', controller.login)
router.post('/registrationpartone',controller.registrationPartOne)
router.post('/resendemail',controller.resendemail)
router.post('/registercreate',controller.registerCreate)
router.get('/sendemail',controller.SendEmail)
//auk








module.exports = router