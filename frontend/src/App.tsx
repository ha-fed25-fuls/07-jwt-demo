import { useState } from 'react'
import './App.css'

// TODO: flytta ut typer och hjälpfunktioner till egna filer
type Form = { username: string; password: string; }
type TokenResponse = {
	jwt: string;
}
type Book = {
	id: string;
	title: string;
	author: string;
	borrowStatus: string;
}
type SetState<T> = (x: T) => void
async function handleTokenResponse(response: Response, set: SetState<string>, username: string): Promise<void> {
	console.log(`Response status: `, response.status)
	if( response.status > 299 ) {
		console.log(`Login/register failade med status från backend: ${response.status}.`)
		return
	}

	const data: unknown = await response.json()
	// TODO: validera TokenResponse
	const token = (data as TokenResponse).jwt
	localStorage.setItem(LS_KEY, token)

	// Nu vet vi att användaren är autentiserad - spara användarnamnet
	set(username)
}
const LS_KEY = 'gotebok-jwt'



const App = () => {
	// Formulärdata
	const [form, setForm] = useState<Form>({
		username: '',
		password: ''
	})

	// Användarinformation. Giltig användare betyder att man är inloggad.
	const [user, setUser] = useState<string>('')

	// Data som hämtas från backend.
	const [data, setData] = useState<Book[]>([])

	// Meddelanden från backend
	const [messages, setMessages] = useState<string[]>([])

	const isAuthenticated: boolean = user !== ''  // beräkna från state-variabler



	const handleLogIn = async () => {
		// bygg ett fetch-request
		// skicka till backend /api/login , vänta på svaret TokenResponse
		// spara JWT i localStorage
		// uppdatera state: setUser

		try {
			// Kom ihåg proxy-inställningen
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			})
			handleTokenResponse(response, setUser, form.username)

		} catch(error) {
			// TODO
		}
	}


	const handleRegister = async () => {
		// bygg ett fetch-request
		// skicka till backend /api/register , vänta på svaret TokenResponse
		// spara JWT i localStorage
		// uppdatera state: setUser

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			})
			handleTokenResponse(response, setUser, form.username)

		} catch(error) {
			// TODO
		}
	}

	const handleLogOut = () => {
		setUser('')
	}

	const handleGetBooks = async () => {
		// bygg fetch request
		// skicka till servern, vänta på svaret
		try {
			const token = localStorage.getItem(LS_KEY)
			const response = await fetch('/api/books', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			if( response.status > 299 ) {
				setMessages([`Fel vid hämtning av böcker: ${response.status}.`, ...messages])
				return
			}
			const data: unknown = await response.json()
			console.log('Data from server:', data)
			// TODO: validera datan med zod-schema
			setData(data as Book[])  // fuska för att spara tid

		} catch(error) {
			const message: string = (error instanceof Error) ? error.message : String(error)
			console.log('get books, något gick fel: ', message)
		}
	}

	// TODO kom ihåg att lyfta ut kod till komponenter
	return (
		<div className="app">
			<header>
				<h1> Götebok - bäst på ordvitsar </h1>
				<h2> Det lilla biblioteket med de stora ambitionerna. </h2>
				<hr />
			</header>
			<main>
				{!isAuthenticated && (
					<>
					<h2> Logga in </h2>
					<section className="form">
						<section className="item">
						<label> Användarnamn </label>
						<input type="text"
							value={form.username}
							onChange={event => setForm({ ...form, username: event.target.value })}
							/>
						</section>

						<section className="item">
						<label> Lösenord </label>
						<input type="password"
							value={form.password}
							onChange={event => setForm({ ...form, password: event.target.value })}
							/>
						</section>

						<div>
							<button onClick={handleLogIn}> Logga in </button>
							<button onClick={handleRegister}> Registrera </button>
						</div>

					</section>
					</>
				)}
				{/* TODO: visa meddelanden, validering, misslyckad inloggning med mera */}
				<ul className="messages">
					{messages.map((m, index) => (
						<li key={index}> {m} </li>
					))}
				</ul>

				<hr />
				{isAuthenticated && (
					<>
					<h2> Logga ut </h2>
					<section className="form">
						<div>
							<button onClick={handleLogOut}> Logga ut </button>
						</div>
					</section>
					</>
				)}

				<hr />

				<h2> Mina favoritböcker </h2>
				<button onClick={handleGetBooks}> Hämta data </button>
				{isAuthenticated ? (
					<>
					<div className="books">
						{data.map(book => (
							<section key={book.id} className="item">
								<p> {book.title}, {book.author} </p>
								<p> Status: {book.borrowStatus} </p>
								<button> {book.borrowStatus === 'lånad' ? 'Återlämna' : 'Låna' } </button>
							</section>
						))}
					</div>
					</>
				) : (
					<p> Logga in för att se dina böcker. </p>
				)}

			</main>
		</div>
	)
}

export default App
