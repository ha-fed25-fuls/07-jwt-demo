// import
import express, { type Express, type RequestHandler } from 'express'
import * as z from 'zod'
import { logger, requireAuth } from './middleware.ts'
import { type TokenResponse, type UserCredentials, type JwtPayload, userCredSchema, type Book, type LoginCredentials, loginCredSchema } from './types.ts'
import { createUser, getUser } from './fakeDb.ts'
import { checkEnvFile } from './utils.ts'
import jwt, { type Jwt } from 'jsonwebtoken'
const { sign } = jwt  // nödvändigt eftersom jsonwebtoken är ett CommonJS paket

// konfiguration
const app: Express = express()
const port: number = 3007
checkEnvFile()
const SECRET = process.env.SECRET!


// middleware
app.use('/', logger)
app.use(express.json())


// endpoints (resurser)

app.post<{}, void | TokenResponse, LoginCredentials>('/api/login', async (req, res) => {
	// kontrollera om användaren finns
	const parsed = z.safeParse(loginCredSchema, req.body)
	if( !parsed.success ) {
		// body är felaktig, svara med 400
		console.log('Felaktig body: ', req.body)
		res.sendStatus(400) // Bad request
		return
	}
	const input: LoginCredentials = parsed.data

	// Använder en fejkad databas för att illustrera principen
	const maybeUser: UserCredentials | undefined = await getUser(input)

	if( !maybeUser ) {
		// Tala aldrig om för frontend om det var fel på användarnamnet eller lösenordet
		res.sendStatus(401)
		return
	}

	// skapa en JWT
	// expiresIn kan vara ett nummer (antal sekunder) eller en sträng typ "15m", "8h" osv.
	const token: string = createJwt(maybeUser.uuid)
	console.log(`Token skapad: ${token} `)
	res.status(200).send({ jwt: token })
})
function createJwt(uuid: string): string {
	return sign({ uuid }, SECRET, { expiresIn: '8h' })
}


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


app.post<{}, TokenResponse, LoginCredentials>('/api/register', async (req, res) => {
	// kontrollera om användaren redan finns eller inte
	// om finns: svara med status 409 Conflict
	// om finns inte: skapa ny användare + lägg till i databasen + logga in (dvs svara med JWT)

	const parsed = z.safeParse(loginCredSchema, req.body)
	if( !parsed.success ) {
		// body är felaktig, svara med 400
		console.log('Felaktig body: ', req.body)
		res.sendStatus(400) // Bad request
		return
	}
	const input: LoginCredentials = parsed.data

	const maybeUser: UserCredentials | undefined = await getUser(input)
	if( maybeUser ) {
		res.sendStatus(409)
		return
	}

	const uuid: string = await createUser(input)
	const token: string = createJwt(uuid)

	console.log(`Registrerad med token: ${token} `)
	res.status(200).send({ jwt: token })
})


const books: Book[] = [
	{ id: '1', title: 'Fellowship of the Ring', author: 'J.R.R. Tolkien', borrowStatus: 'lånad' },
	{ id: '2', title: 'The Two Towers', author: 'J.R.R. Tolkien', borrowStatus: 'tillgänglig' },
	{ id: '3', title: 'Return of the King', author: 'J.R.R. Tolkien', borrowStatus: 'tillgänglig' },
]


// listen
app.listen(port, () => {
	console.log(`Server is listening on port ${port}.`)
})

