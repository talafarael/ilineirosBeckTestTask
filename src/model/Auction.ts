const {model, Schema} = require("mongoose")
const Auction = new Schema({
	img: {type: String,},
    name: {type: String,},
    value:{type:String},
    rates:{type:String},
	time: {type: String, required: true},
	timeLive:{type:Number},
    listRates:{}
})
module.exports = model("Auction",Auction)
