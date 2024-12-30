import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRET_KEY || "strong-key";

import bcrypt from "bcrypt";
const saltRounds = 10;



export async function hashPassword(password: string) {
	let result = '';
	await bcrypt.hash(password, saltRounds).then(function (hash) {
		result = hash;
	});
	return result;
}

export async function verifyPassword(password: string, passHash: string) {
	const result = await bcrypt.compare(password, passHash);
	return result;
}

//generate the token
export async function generateToken(username: string) {
	return jwt.sign({ username: username, accessLevel: "user" }, secretKey, {
		expiresIn: "15d",
	});
}

export function verifyToken(token: string) {
	return jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			console.log(err);
		} else {
			return decoded;
		}
	});
}
