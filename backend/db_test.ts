import * as db_methods from "./db_methods.ts";


await db_methods.createTable();
await db_methods.createGameTable();
await db_methods.CreatePlayerGameTable();
// const playerGames = await db_methods.getPlayerGame();
// console.log(playerGames);

// await db_methods.insertUser('Container_Aidan', `aidan@email.com`);
// await db_methods.insertUser('Container_Penny', `penny@email.com`);

// const users = await db_methods.getUsers();
// console.log(users);


