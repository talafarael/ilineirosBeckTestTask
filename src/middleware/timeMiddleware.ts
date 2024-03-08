import { models } from "mongoose";





async function verifyTime(timeEnd: string, res: any) {
    var currentDate = new Date()
   const endTime= new Date(timeEnd)
   if(endTime<currentDate){  console.log("false")
   return false
 
   }
   console.log(';afa')
   return true
}

module.exports =verifyTime