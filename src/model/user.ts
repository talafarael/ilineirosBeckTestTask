const {model, Schema} = require("mongoose")
const user = new Schema({
	email: {type: String, uniqne: true, required: true},
	password: {type: String, required: true},
	balance:{type:Number},
	bidAuction:{type:[]},
	ownAuction:{type:[]}
})
module.exports= model("User", user)
