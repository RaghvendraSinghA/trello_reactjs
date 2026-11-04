import express from "express"
import { WebSocketServer, WebSocket } from "ws"

const app = express()

app.use(express.json())

const server = app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000")
})

const wss = new WebSocketServer({ server })

wss.on("connection", (socket) => {
    console.log("Browser connected")

    socket.on("close", () => {
        console.log("Browser disconnected")
    })
})

// Your frontend makes the WebSocket connection, not trello official.
//trello official only post on our backend on /trello-webhook.
//our browser have connected to backed

app.head("/trello-webhook", (request, response) => {
    response.sendStatus(200)
})

// Why does Trello need this?

// When you create a webhook, trello official needs to verify that your callback URL is reachable.

// So it can send a HEAD request to:

// /trello-webhook

// Your code responds:

// 200 OK

// which tells Trello:

// "Yes, this URL exists and my server is reachable."

app.post("/trello-webhook", (request, response) => {

    //trello official only make post connection to backend, it not connect to scoket
    console.log("Trello webhook received:")
    console.log("request body",request.body)
    // console.log("request ",request)
    console.log("action--------------------->")
    console.log(request.body.action)

    const message = JSON.stringify({
        type: "trello-update",
        data: request.body
    })

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message)
        }
    })

    //here trello is sending data to each frontend whenever trello official hit out backend.
    response.sendStatus(200)
})

app.get("/", (request, response) => {
    response.send("<h1>Helllllllllo from Home!</h1>")
})