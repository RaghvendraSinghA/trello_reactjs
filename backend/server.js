
const API_KEY = "b08e0c3d61bbed9d1070ce21be520b01"
const TOKEN = "ATTA82b35392befe25f9b35d80a2ac28100919a0bd75326df748e9497b4a70a6bb181CDDBC28"

const BOARD_ID = "6ab0c5f4971b01c62976eb5e"


//this return list of all boards of trello.


async function getAllBoards() {
  const response = await fetch(
    `https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${TOKEN}`
  )

  const boards = await response.json()

  for (const board of boards) {
    console.log("board", board)
    console.log("full image:", board.prefs.backgroundImage)
    console.log("color:", board.prefs.backgroundColor)
  }
}

// getAllBoards()





//this only returns cardlists not cards inside cardlist. using loop then we will get all cards of cardlist
async function getCardList() {
  const cardListResponse = await fetch(
    `https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${API_KEY}&token=${TOKEN}`
  )

  const cardLists = await cardListResponse.json()

  console.log("cardlistsofaBoard", cardLists)
}

// getCardList()



//fetch cards only not their checklist and checkItems.

async function fetchCardsOfCardLists(cardlistId) {

  if (!cardlistId) {
    return
  }
  const url = `https://api.trello.com/1/lists/${cardlistId}/cards?key=${API_KEY}&token=${TOKEN}`
  const response = await fetch(url)
  const data = await response.json()

  console.log("cards", data)
}

// fetchCardsOfCardLists("6abe1fc87635f6c6d7f522e1")



// this fetches checklists and checkItems of card
async function fetchCardCheckLists(cardId) {
  const url = `https://api.trello.com/1/cards/${cardId}/checklists?checkItems=all&key=${API_KEY}&token=${TOKEN}`
  const response = await fetch(url)
  const data = await response.json()

  console.log("cradCheckItemAndCheckListdata", data)
}

// fetchCardCheckLists("6abe1fd1958fded2245ce361")



async function postNewCardList(name) {

    if(!name){
        return
    }

    const url = new URL("https://api.trello.com/1/lists")

    url.searchParams.set("key", API_KEY)
    url.searchParams.set("token", TOKEN)
    url.searchParams.set("name", name)
    url.searchParams.set("idBoard", BOARD_ID)

    const response = await fetch(url, {
        method: "POST"
    })

    if (!response.ok) {
        throw new Error(await response.text())
    }

    return await response.json()
}





// console.log(postNewCardList("addingCardList"))
