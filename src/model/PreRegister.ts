const {model, Schema} = require("mongoose")
const PreRegister= new Schema({
	avatar:{type: String},
	name: {type: String},
	email: {type: String, uniqne: true, required: true},
	password: {type: String, required: true},
	balance:{type:Number},
	code:{type:Number},
	status:{type:Boolean},
	bidAuction:{type:[]},
	ownAuction:{type:[]},
	token: {type: String},
}, { timestamps: true })
PreRegister.index( { "createdAt": 1 }, { expireAfterSeconds: 420 }  );
module.exports = model("PreRegister", PreRegister)

