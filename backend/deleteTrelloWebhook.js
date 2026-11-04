import "dotenv/config"

const { API_KEY, TOKEN } = process.env

const WEBHOOK_ID = "6ae9d7291f89b352535ab98b"

const url =
    `https://api.trello.com/1/tokens/${TOKEN}/webhooks/${WEBHOOK_ID}` +
    `?key=${API_KEY}`

const response = await fetch(url, {
    method: "DELETE"
})

if (response.ok) {
    console.log("Webhook deleted successfully!")
} else {
    console.log("Failed to delete webhook:", response.status)
    console.log(await response.text())
}



//This gives list of all webhooks registered by user.
const response2 = await fetch(
    `https://api.trello.com/1/tokens/${TOKEN}/webhooks?key=${API_KEY}`
)

console.log(await response2.json())