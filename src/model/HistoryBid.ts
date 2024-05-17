


const {model, Schema} = require("mongoose")
const HistoryBid = new Schema({
	ListUser: [{
		id: { type: String, required: true },
		number:{type: Number, required: true },
		time:{type: String,},
		user:{type:String}
}],
	idAUction:{type:String}
})

module.exports = model("HistoryBid", HistoryBid)
