# JWT frontend

React frontend som skapats med `npm create vite@latest`.

Biblioteket Götebok har en inloggningstjänst. När man är inloggad kan man visa en lista över ens favoritböcker och om man har lånat dem eller inte.

Backend endpoints som behövs:
<!-- TODO: backend GET /books -->
<!-- TODO: backend POST /register -->
<!-- TODO: backend GET /signin -->
<!-- TODO: backend GET /signout -->
```text
GET /books
Hämtar status för böckerna. Kräver inloggning.
200 - okej, returnerar Book[]
401 - unauthorized
```
```text
POST /register {username, password}
Registrerar en ny användare.
200 { jwt } - ok, returnerar JWT
400 - bad request
```
```text
POST /signin {username, password}
Loggar in en existerande användare.
200 { jwt } - ok, returnerar JWT
400 - bad request
401 - unauthorized, fel användarnamn eller lösenord
```
```text
POST /signout
Loggar ut användaren genom att rensa JWT från localStorage. Kom ihåg att rensa state-variabler.
201 - no content
```

JWT ska innehålla användarens id.

