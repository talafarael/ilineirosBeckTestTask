
import jwt, { JwtPayload } from "jsonwebtoken";
const { secret } = require("../config");
const User = require("../model/user");

async function verifyToken(token: string, res: any) {
    try {
        if (!token) {
			return res
				.status(403)
				.json({message: "Пользователь не авторизован"})
		}
        console.log(secret)
        console.log(token)
        const decodedData = await jwt.verify(token, secret) as JwtPayload;
        const id = decodedData.id;
        console.log(decodedData)
        const user = await User.findById(id.trim());
        if (!user) {
            return res.status(400).json({
                message: "The user with this name does not exist",
            });
        }
        return {user ,id};
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}

module.exports = verifyToken;