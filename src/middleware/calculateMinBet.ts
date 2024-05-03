import  { Response} from "express"
export const calculateMinBet=(allSum:number,bid:number,res:Response)=>{
	if(allSum<10000){
		if(allSum*1.1>=bid){
   return res.status(400).json({
							message:
								"sum must be higher 10% than now",
						})
		}
}else if(allSum<100000){
	if(allSum*1.05>=bid){
		return res.status(400).json({
						message:
							"sum must be higher 5% than now",
					})
	}
}else if(allSum<1000000){
	if(allSum*1.01>=bid){
		return res.status(400).json({
						message:
							"sum must be higher 1% than now",
					})
	}
}

}

