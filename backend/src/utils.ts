export function checkEnvFile(): void {
	// Om en variabel i env-filen saknas, avbryt programmet och skriv ut ett meddelande på konsolen. Vi kan använda valfri felkod som inte är noll.
	if( !process.env.SECRET ) {
		console.log('Hittar inte SECRET i .env-filen!')
		process.exit(1)
	}
}
