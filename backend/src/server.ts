// import
import express, { type Express, type RequestHandler } from 'express'


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


// endpoints (resurser)

// Backend endpoints som behövs:
// <!-- TODO: backend GET /books -->
// <!-- TODO: backend POST /register (senare) -->
// <!-- TODO: backend GET /signin -->
// <!-- TODO: backend GET /signout -->

// listen
app.listen(port, () => {
	console.log(`Server is listening on port ${port}.`)
})

