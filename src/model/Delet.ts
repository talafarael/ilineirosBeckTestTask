const {model, Schema} = require("mongoose")
const AuctionDelete = new Schema({
idUser:{type:String},
id:{type:String},
password:{type:String}
}, { timestamps: true })
AuctionDelete.index( { "createdAt": 1 }, { expireAfterSeconds: 420 }  );
module.exports = model("AuctionDelete",AuctionDelete)
