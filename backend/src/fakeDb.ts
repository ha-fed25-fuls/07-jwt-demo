import type { LoginCredentials, UserCredentials } from "./types.ts"
import {genSalt, hash, compare} from 'bcrypt'


export async function getUser(input: LoginCredentials): Promise<UserCredentials | undefined> {
	for( const user of userDb ) {
		if( await usersMatch(input, user) ) {
			return user
		}
	}
	return undefined
	// Vanlig find fungerar inte eftersom vi använder asnykron version av bcrypt-funktionerna
	// return userDb.find(async u => await usersMatch(input, u))
}


async function usersMatch(input: LoginCredentials, fromDb: UserCredentials): Promise<boolean> {
	// Vi förväntar oss att frontend trimmar strängarna och kräver att strängarna är exakt lika
	const compareResult = await compare(input.password, fromDb.password)
	console.log(`usersMatch compare result: ${input.password}, ${fromDb.password}, ${compareResult} `)
	if( input.username === fromDb.username && compareResult ) {
		return true
	}
	return false
}

// // Jämför ett lösenord med det sparade, vid inloggning
// const loginSuccess: boolean = compare(password, hashed)


// Returns uuid
export async function createUser(creds: LoginCredentials): Promise<string> {
	const salt: string = await genSalt(10)
	const hashed: string = await hash(creds.password, salt)

	const uc: UserCredentials = {
		username: creds.username,
		password: hashed,
		uuid: crypto.randomUUID()
	}
	userDb.push(uc)
	console.log('Create user: ', uc)  // TODO: kom ihåg att ta bort denna
	return uc.uuid
}


// Denna "databas" använder username istället för id
const userDb: UserCredentials[] = [
	// { uuid: '1', username: 'Valentino', password: 'hotpink' }
]


