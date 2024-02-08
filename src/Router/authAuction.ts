const {Auction}=require('../model/Auction')

interface Body {
	name:string,
	time:string,
	timeLive:number,
	rates:number,
	value:string
	}

class {
    async createAuction(req, res){
					const {name,time,rates,timeLive,value}:Body=req.body

					const auction=new Auction({
					
						img:'',
						name:name,
						value:value,
						rates:rates,
						timeLive:timeLive,
						listRates:[],

					})
					await auction.save()



					res.status(200).json({ success: true, message: 'Auction created successfully' });
					

				}
}