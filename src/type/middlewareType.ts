import  { Response} from "express"
import { IUser } from "./mongoType"
export interface checkUserOwner{
	res: Response,
	user:IUser,
	_id:string
}
export interface IUserBid{
	userId:string,
	sum:number
}