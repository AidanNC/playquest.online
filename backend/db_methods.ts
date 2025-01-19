import sqlite3 from "sqlite3";
import { open } from "sqlite";


async function init(){
	await createTable();
	await createGameTable();
	await CreatePlayerGameTable();
}
// Open a database connection
async function openDb() {
	return open({
		filename: "./database.db",
		driver: sqlite3.Database,
	});
}

// Create a table
async function createTable() {
	console.log("Creating user table");
	const db = await openDb();
	console.log("Opened database");
	await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      passhash TEXT NOT NULL,
      email TEXT NOT NULL,
	  inGameID TEXT NOT NULL
    )
  `);
}

function randomID(username: string): string {
	const random = Math.floor(Math.random() * 1000000);
	return username + random.toString();
}
// Insert a user
async function insertUser(username: string, passhash: string, email: string) {
	const inGameID = randomID(username);
	const db = await openDb();
	await db.run(
		"INSERT INTO users (username, passhash, email, inGameID) VALUES (?, ?, ?, ?)",
		[username, passhash, email, inGameID]
	);
}

async function createGameTable() {
	console.log("Creating game table");
	const db = await openDb();
	await db.exec(`
		CREATE TABLE IF NOT EXISTS games (
			gid INTEGER PRIMARY KEY AUTOINCREMENT,
			date INTEGER NOT NULL,
			gameLocation TEXT NOT NULL
		)
		`);
}
async function InsertGame(date: number, gameLocation: string) {
	const db = await openDb();
	await db.run("INSERT INTO games (date, gameLocation) VALUES (?, ?)", [
		date,
		gameLocation,
	]);
}

async function getGameByDate(date: number) {
	const db = await openDb();
	return db.get("SELECT * FROM games WHERE date = ?", [date]);
}

async function CreatePlayerGameTable() {
	console.log("Creating player game table");
	const db = await openDb();
	await db.exec(`
		CREATE TABLE IF NOT EXISTS playerGame (
			pid NOT NULL,
			gid INTEGER NOT NULL,
			score INTEGER NOT NULL,
			gameIndex INTEGER NOT NULL,
			FOREIGN KEY (gid) REFERENCES games(gid),
			FOREIGN KEY (pid) REFERENCES users(id)
		)
		`);
}

async function InsertPlayerGame(
	pid: number,
	gid: number,
	score: number,
	gameIndex: number
) {
	const db = await openDb();
	await db.run(
		"INSERT INTO playerGame (pid, gid, score, gameIndex) VALUES (?, ?, ?, ?)",
		[pid, gid, score, gameIndex]
	);
}

// Get all player games
async function getPlayerGame() {
	const db = await openDb();
	return db.all("SELECT * FROM playerGame");
}

// Get all users
async function getUsers() {
	const db = await openDb();
	return db.all("SELECT * FROM users");
}

// Get a user by ID
async function getUserById(id: number) {
	const db = await openDb();
	return db.get("SELECT * FROM users WHERE id = ?", [id]);
}

async function getUserByInGameID(inGameID: string): Promise<
	| {
			id: number;
			username: string;
			passhash: string;
			email: string;
			inGameID: string;
	  }
	| undefined
> {
	const db = await openDb();
	return db.get("SELECT * FROM users WHERE inGameID = ?", [inGameID]);
}

async function getUserByUsername(username: string): Promise<
	| {
			id: number;
			username: string;
			passhash: string;
			email: string;
			inGameID: string;
	  }
	| undefined
> {
	const db = await openDb();
	return db.get("SELECT * FROM USERS WHERE username = ?", [username]);
}
// Update a user
async function updateUser(id: number, name: string, email: string) {
	const db = await openDb();
	await db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [
		name,
		email,
		id,
	]);
}

// Delete a user
async function deleteUser(id: number) {
	const db = await openDb();
	await db.run("DELETE FROM users WHERE id = ?", [id]);
}




export {
	openDb,
	createTable,
	insertUser,
	getUsers,
	getUserById,
	getUserByUsername,
	updateUser,
	deleteUser,
	createGameTable,
	InsertGame,
	CreatePlayerGameTable,
	InsertPlayerGame,
	getGameByDate,
	getUserByInGameID,
	getPlayerGame,
	init,
};
