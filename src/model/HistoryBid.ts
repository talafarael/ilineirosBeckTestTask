


const {model, Schema} = require("mongoose")
const HistoryBid = new Schema({
	ListUser: [{
		id: { type: String, required: true },
		sum:{type: Number, required: true },
		time:{type: String,},
		user:{type:String}
}],
	idAuction:{type:String}
})

module.exports = model("HistoryBid", HistoryBid)
