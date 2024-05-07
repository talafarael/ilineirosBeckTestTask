const {model, Schema} = require("mongoose")
const HistoryBid = new Schema({
	ListUser: {type:[]},
	idAUction:{type:String}
})

module.exports = model("HistoryBid", HistoryBid)
