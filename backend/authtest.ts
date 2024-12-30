import { hashPassword, generateToken, verifyToken, verifyPassword } from "./auth";
import * as db_methods from "./db_methods.ts";


const username = "testuser";
const password = "testpassword";
const email = "test@email.com";

await hashPassword(password);

await db_methods.createTable();

// const passhash = await hashPassword(password);

// await db_methods.insertUser(username, passhash, email);

const users = await db_methods.getUserByUsername("testuser");
console.log(users);


// const token = await generateToken("testuser", password);
// console.log(token);

// const result = verifyToken(token);
