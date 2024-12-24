
export async function createGame(numPlayers: number) {
	const url = `/api/createGame?numPlayers=${numPlayers}`
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

