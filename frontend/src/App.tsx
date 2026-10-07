import { useState } from 'react'
import './App.css'

type Form = { username: string; password: string; }
type TokenResponse = {
	jwt: string;
}

const App = () => {
	// Formulärdata
	const [form, setForm] = useState<Form>({
		username: '',
		password: ''
	})

	// Användarinformation. Giltig användare betyder att man är inloggad.
	const [user, setUser] = useState<string>('')

	// Data som hämtas från backend.
	const [data, setData] = useState([])  // TODO type

	// Meddelanden från backend
	const [messages, setMessages] = useState([])  // TODO type

	const isAuthenticated: boolean = user !== ''  // beräkna från state-variabler


	const LS_KEY = 'gotebok-jwt'

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
			console.log(`Response status: `, response.status)

			const data: unknown = await response.json()
			// TODO: validera TokenResponse
			const token = (data as TokenResponse).jwt
			localStorage.setItem(LS_KEY, token)

			// Nu vet vi att användaren är autentiserad - spara användarnamnet
			setUser(form.username)

		} catch(error) {
			// TODO
		}
	}

	const handleLogOut = () => {
		setUser('')
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
				{/* TODO: visas när man inte är inloggad */}
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
						</div>

						{/* TODO: visa meddelanden, validering, misslyckad inloggning med mera */}
						<p className="messages"> </p>
					</section>
					</>
				)}

				<hr />
				{/* TODO: visas bara när man är inloggad */}
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
				<button> Hämta data </button>
				{/* TODO: visas bara när man är inloggad */}
				{isAuthenticated ? (
					<>
					<div className="books">
						<section className="item">
							<p> Fellowship of the Ring, J.R.R. Tolkien </p>
							<p> Status: lånad </p>
							<button> Återlämna </button>
						</section>

						<section className="item">
							<p> The Two Towers, J.R.R. Tolkien </p>
							<p> Status: tillgänglig </p>
							<button> Låna </button>
						</section>

						<section className="item">
							<p> Return of the King, J.R.R. Tolkien </p>
							<p> Status: tillgänglig </p>
							<button> Låna </button>
						</section>
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
