const {model, Schema} = require("mongoose")
const AuctionDelete = new Schema({
id:{type:String},
password:{type:String}
})
module.exports = model("AuctionDelete",AuctionDelete)
