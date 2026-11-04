import "dotenv/config"

const { API_KEY, TOKEN, BOARD_ID } = process.env

const callbackURL =
    "https://ought-maturing-obscurity.ngrok-free.dev/trello-webhook"

const url =
    `https://api.trello.com/1/tokens/${TOKEN}/webhooks` +
    `?key=${API_KEY}` +
    `&callbackURL=${encodeURIComponent(callbackURL)}` +
    `&idModel=${BOARD_ID}` +
    `&description=${encodeURIComponent("My Trello Clone Webhook")}`

const response = await fetch(url, {
    method: "POST"
})

const data = await response.json()

console.log(data)


//I have ran this file while registering hook to trello website for first time, no 
//need to run again