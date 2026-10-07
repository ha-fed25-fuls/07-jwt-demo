// import
import express, { type Express, type RequestHandler } from 'express'
import jwt, { type Jwt } from 'jsonwebtoken'
import * as z from 'zod'
import { logger, requireAuth } from './middleware.ts'
import { type TokenResponse, type UserCredentials, type JwtPayload, userCredSchema, type Book } from './types.ts'
import { getUser } from './fakeDb.ts'
import { checkEnvFile } from './utils.ts'
const { sign } = jwt  // nödvändigt eftersom jsonwebtoken är ett CommonJS paket

// konfiguration
const app: Express = express()
const port: number = 3007
checkEnvFile()


// middleware
app.use('/', logger)
app.use(express.json())


// endpoints (resurser)
const SECRET = '1234'  // denna ska finnas i .env-filen. OBS! Använd ett SUPERSÄKERT lösenord när du gör detta på riktigt!


app.post<{}, void | TokenResponse, UserCredentials>('/api/login', (req, res) => {
	// kontrollera om användaren finns
	const parsed = z.safeParse(userCredSchema, req.body)
	if( !parsed.success ) {
		// body är felaktig, svara med 400
		res.sendStatus(400) // Bad request
		return
	}
	const input: UserCredentials = parsed.data

	// Använder en fejkad databas för att illustrera principen
	const maybeUser: UserCredentials | undefined = getUser(input)

	if( !maybeUser ) {
		// Tala aldrig om för frontend om det var fel på användarnamnet eller lösenordet
		res.sendStatus(401)
		return
	}

	// skapa en JWT
	// expiresIn kan vara ett nummer (antal sekunder) eller en sträng typ "15m"
	// Vi använder en kort tid för att kunna testa
	const token: string = sign({ uuid: maybeUser.uuid }, SECRET, { expiresIn: 15 })
	console.log(`Token skapad: ${token} `)
	res.status(200).send({ jwt: token })
})


app.get<{}, Book[]>('/api/books', requireAuth, (req, res) => {
	// finns Authorization header?
	// kolla om användaren i auth header finns i databasen
	// om ja: svara med boklistan
	const auth: string | undefined = req.headers.authorization
	if( !auth ) {
		res.sendStatus(401)
		return
	}

	res.status(200).send(books)
})



const books: Book[] = [
	{ id: '1', title: 'Fellowship of the Ring', author: 'J.R.R. Tolkien', borrowStatus: 'lånad' },
	{ id: '2', title: 'The Two Towers', author: 'J.R.R. Tolkien', borrowStatus: 'tillgänglig' },
	{ id: '3', title: 'Return of the King', author: 'J.R.R. Tolkien', borrowStatus: 'tillgänglig' },
]


// Backend endpoints som behövs:
// <!-- TODO: backend GET /books -->
// <!-- TODO: backend POST /register (senare) -->
// <!-- TODO: backend POST /signin -->
// "signout" görs i frontend!

// listen
app.listen(port, () => {
	console.log(`Server is listening on port ${port}.`)
})

