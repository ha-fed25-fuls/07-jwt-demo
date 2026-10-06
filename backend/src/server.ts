// import
import express, { type Express, type RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
const { sign, verify } = jwt  // nödvändigt eftersom jsonwebtoken är ett CommonJS paket

// konfiguration
const app: Express = express()
const port: number = 3007

// middleware
export function formatTimestamp(date: Date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const min = pad(date.getMinutes())
    const ss = pad(date.getSeconds())
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}
const logger: RequestHandler = (req, res, next) => {
	const now = formatTimestamp()
	console.log(`${now}  ${req.method}  ${req.url}`)
	next()
}
app.use('/', logger)
app.use(express.json())


// endpoints (resurser)
type TokenResponse = {
	jwt: string;
}
type UserCredentials = {
	uuid: string;
	username: string;
	password: string;
}
type JwtPayload = {
	uuid: string;
}
const SECRET = '1234'  // denna ska finnas i .env-filen. OBS! Använd ett SUPERSÄKERT lösenord när du gör detta på riktigt!

app.post<{}, void | TokenResponse, UserCredentials>('/api/login', (req, res) => {
	// kontrollera om användaren finns
	// Att göra: validera body (med en middleware)
	// Om body är felaktig, svara med 400
	const input: UserCredentials = req.body
	const maybeUser: UserCredentials | undefined = userDb.find(u => usersMatch(input, u))

	if( !maybeUser ) {
		// Tala aldrig om för frontend om det var fel på användarnamnet eller lösenordet
		res.sendStatus(401)
		return
	}

	// skapa en JWT
	// expiresIn kan vara ett nummer (antal sekunder) eller en sträng typ "15m"
	// Vi använder en kort tid för att kunna testa
	const token: string = sign({ uuid: maybeUser.uuid }, SECRET, { expiresIn: 10 })
	console.log(`Token skapad: ${token} `)
	res.status(200).send({ jwt: token })
})
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

// Backend endpoints som behövs:
// <!-- TODO: backend GET /books -->
// <!-- TODO: backend POST /register (senare) -->
// <!-- TODO: backend POST /signin -->
// <!-- TODO: backend POST /signout -->

// listen
app.listen(port, () => {
	console.log(`Server is listening on port ${port}.`)
})

