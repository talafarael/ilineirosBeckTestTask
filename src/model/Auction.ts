const {model, Schema} = require("mongoose")
const Auction = new Schema({
	img: {type: String,},
    title: {type: String,},
    minRates:{type: String},
    desct:{type:String},
    rates:{type:String},
    timeStart:{type:String},
    timeEnd:{type:String},
	timeLive:{type:Number},
    listRates:{type:[]},
    owner:{type:String}
})
module.exports = model("Auction",Auction)
