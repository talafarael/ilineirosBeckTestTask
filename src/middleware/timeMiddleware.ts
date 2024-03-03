




async function verifyToken(timeEnd: string, res: any) {
    var currentDate = new Date()
   const endTime= new Date(timeEnd)
   if(endTime<currentDate){
res.status(400).json({
    message: "Inv",
});
   }
}