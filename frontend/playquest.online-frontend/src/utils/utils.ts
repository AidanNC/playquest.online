import { CheckLoggedIn } from "./backend"
export async function isLoggedIn(){
	const result =  await CheckLoggedIn();
	if (result.loggedIn === true) {
		return true;
	}
	return false;
}