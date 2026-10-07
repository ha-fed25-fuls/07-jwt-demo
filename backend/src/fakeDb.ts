import type { UserCredentials } from "./types.ts"

export function getUser(input: UserCredentials): UserCredentials | undefined {
	return userDb.find(u => usersMatch(input, u))
}


function usersMatch(input: UserCredentials, fromDb: UserCredentials): boolean {
	// Vi förväntar oss att frontend trimmar strängarna och kräver att strängarna är exakt lika
	if( input.username === fromDb.username && input.password === fromDb.password ) {
		return true
	}
	return false
}

// Denna "databas" använder username istället för id
const userDb: UserCredentials[] = [
	{ uuid: '1', username: 'Valentino', password: 'hotpink' }
]

