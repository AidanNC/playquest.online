
export async function createGame(numPlayers: number) {
	const websocketUrl = import.meta.env.VITE_API_URL || "ws://10.0.0.66";
	// const url = `/api/createGame?numPlayers=${numPlayers}`
	// const websocketUrl = `https://playquest.online/api`
	const url = `${websocketUrl}/createGame?numPlayers=${numPlayers}`

	console.log("Connecting to", url);

	try {
		const response = await fetch(url);
		if (!response.ok) {
		  throw new Error(`Response status: ${response.status}`);
		}
	
		const json = await response.json();
		return json;
	  } catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error(String(error));
		}
	  }
}

