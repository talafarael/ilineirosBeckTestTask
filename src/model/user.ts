const {model, Schema} = require("mongoose")
const user = new Schema({
	name: {type: String},
	email: {type: String, uniqne: true, required: true},
	password: {type: String, required: true},
	balance:{type:Number},
	bidAuction:{type:[]},
	ownAuction:{type:[]},
	img:{type:String}
})
module.exports= model("User", user)
