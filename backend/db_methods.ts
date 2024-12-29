import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection
async function openDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database
  });
}

// Create a table
async function createTable() {
  console.log("Creating table");
  const db = await openDb();
  console.log("Opened database");
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )
  `);
}

// Insert a user
async function insertUser(name: string, email: string) {
  const db = await openDb();
  await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
}

// Get all users
async function getUsers() {
  const db = await openDb();
  return db.all('SELECT * FROM users');
}

// Get a user by ID
async function getUserById(id: number) {
  const db = await openDb();
  return db.get('SELECT * FROM users WHERE id = ?', [id]);
}

// Update a user
async function updateUser(id: number, name: string, email: string) {
  const db = await openDb();
  await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
}

// Delete a user
async function deleteUser(id: number) {
  const db = await openDb();
  await db.run('DELETE FROM users WHERE id = ?', [id]);
}



export { createTable, insertUser, getUsers, getUserById, updateUser, deleteUser };