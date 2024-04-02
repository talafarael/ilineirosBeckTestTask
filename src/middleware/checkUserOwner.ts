import { checkUserOwner } from "../type/middlewareType"


async function checkUserOwner({res,user,_id}: checkUserOwner){
try{
	const Owner = await user.ownAuction
const checkOwner = Owner.find((auction: string) => auction == _id)
if (!checkOwner) {
	return res.status(400).json({message: "You are not owner"})
}
console.log('aaaa')
console.log( checkOwner)
return checkOwner
} catch (error) {
	return res.status(401).json({
					message: "Invalid token",
	});
}
}


module.exports = checkUserOwner