interface Body {
	name:string,
	time:string,
	minimalSumm:number,
	value:string
	}

class auctionController{
    async createAuction(req, res){
					const {name,time,minimalSumm,value}:Body=req.body



					
					res.status(200).json({ success: true, message: 'Auction created successfully' });
					

				}
}