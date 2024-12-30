import jwt, {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRET_KEY || "strong-key";

// const username = "testuser";
// const password = "testpassword";
let passHash: string = "I didn't change";

import bcrypt from "bcrypt";
const saltRounds = 10;

export function getPassHash(){
	return passHash;
}

export async function hashPassword(password: string) {
	await bcrypt.hash(password, saltRounds).then(function(hash) {
		passHash = hash;
	});
}

export async function verifyPassword(password: string) {
	const result = await bcrypt.compare(password, passHash);

	return result;
}

//generate the token
export async function generateToken(username: string, password: string) {
	if (await verifyPassword(password)) {
		console.log("Password is correct");
		return jwt.sign({ username: username, accessLevel: "user" }, secretKey, {
			expiresIn: "15d",
		});
	} else {
		console.log("Password is incorrect");
		return "Invalid password";
	}
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
