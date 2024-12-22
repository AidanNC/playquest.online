import express from "express";
import HostGame from "./wss";
const app = express();
const port = 4000;

// app.get("/startGame", (req, res) => {
// 	res.send("Hello World!");
// });

// app.post('/api/data', (req, res) => {
// 	const data = req.body;
// 	res.json({ receivedData: data });
//   });

// app.listen(port, () => {
// 	console.log(`Example app listening on port ${port}`);
// });

HostGame(8007, 3);