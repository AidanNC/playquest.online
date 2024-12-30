export async function createGame(numPlayers: number, botCount: number) {
	const websocketUrl = import.meta.env.VITE_API_URL || "ws://10.0.0.66";
	// const url = `/api/createGame?numPlayers=${numPlayers}`
	// const websocketUrl = `https://playquest.online/api`
	const url = `${websocketUrl}/createGame?numPlayers=${numPlayers}&botCount=${botCount}`;

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

export async function login(username: string, password: string) {
	const baseUrl = import.meta.env.VITE_API_URL || "ws://10.0.0.66";
	// const url = `/api/createGame?numPlayers=${numPlayers}`
	// const websocketUrl = `https://playquest.online/api`
	const url = `${baseUrl}/login`;
	const data = { username, password };

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
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



export async function register(username: string, password: string, email: string) {
	const baseUrl = import.meta.env.VITE_API_URL || "ws://10.0.0.66";
	// const url = `/api/createGame?numPlayers=${numPlayers}`
	// const websocketUrl = `https://playquest.online/api`
	const url = `${baseUrl}/register`;
	const data = { username, password, email};

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
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

