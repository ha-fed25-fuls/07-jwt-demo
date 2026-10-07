import type { RequestHandler } from "express"
import jwt from "jsonwebtoken"
const { verify, JsonWebTokenError, TokenExpiredError } = jwt

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

export const logger: RequestHandler = (req, res, next) => {
	const now = formatTimestamp()
	console.log(`${now}  ${req.method}  ${req.url}`)
	next()
}


// Kräv inloggning
export const requireAuth: RequestHandler = (req, res, next) => {
	const maybeAuth: string | undefined = req.headers.authorization

	if( !maybeAuth ) {
		console.log(`- inloggningmiddleware: auth finns inte.`)
		res.sendStatus(401)
		return
	}

	// plocka bort "Bearer " från auth-strängen
	// console.log('Auth before:   ' + auth)
	const token = maybeAuth.substring(7)
	// console.log('Auth after:    ' + token)
	try {
		// Verify kan kasta fel om token är för gammal eller felaktig
	// Det är okej att använda ! eftersom vi kontrollerar .env-filen i början av server.ts
		const verifiedToken = verify(token, process.env.SECRET!)
		// console.log('Auth verified:  ', verifiedToken)
		next()

	} catch(error: unknown) {
		if( error instanceof TokenExpiredError ) {
			console.log('För gammal token! Var snabbare nästa gång, eller logga in igen!')
			res.sendStatus(401)
			return
		} else if( error instanceof JsonWebTokenError ) {
			console.log('Felaktig token! Logga in igen!')
			res.sendStatus(401)
			return
		}
		const message = (error instanceof Error) ? error.message : String(error)
		console.log('Okänt fel!', message)
		res.sendStatus(500) // okänt fel
	}
}
