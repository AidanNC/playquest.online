import { hashPassword, generateToken, verifyToken, verifyPassword, getPassHash } from "./auth";


const password = "testpassword";
await hashPassword(password);

const token = await generateToken("testuser", password);
console.log(token);

const result = verifyToken(token);
console.log(result);