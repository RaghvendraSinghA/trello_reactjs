import { createContext, useState, useEffect } from "react"


const DataContext = createContext({})
//We call data-store as DataContext, its values are filled by DataProvider

//DataProvider is used to calculate values, do api call and also fill values to DataContext and also Pass Children to DataContext.Provider

function DataProvider({ children }) {

    const [boards, setBoards] = useState([])
    const [cardLists, setCardLists] = useState([])
    const [cards, setCards] = useState([])
    const [checklists, setChecklists] = useState([])
    const [checkItems, setCheckItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetchedCardListsFromDb, setFetchedCardListsFromDb] = useState(new Set())
    const [fetchedBoardsFromDb, setFetchedBoardsFromDb] = useState(new Set())
    const [openPopUp, setOpenPopUp] = useState(false)
    const [popUpData, setPopUpData] = useState([])


    const [fetchedCardsForPopUp, setFetchedCardsForPopUp] = useState({})
    const [currentPopUpCard, setCurrentPopCard] = useState({})



    const API_KEY = import.meta.env.VITE_API_KEY
    const TOKEN = import.meta.env.VITE_TOKEN


    const handleFetchAllBoards = async () => {
        try {

            setLoading(true)
            const response = await fetch(
                `https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${TOKEN}`
            )

            if (!response.ok) {
                throw new Error(`Trello error ${response.status}`)
            }
            const fetchedBoards = await response.json()

            // console.log("fetchedBoards", fetchedBoards)

            setBoards((prev) => {
                const allBoards = [...prev, ...fetchedBoards]

                const filtereBoard = []
                const isBoardExist = new Set()

                for (const board of allBoards) {
                    if (!isBoardExist.has(board["id"])) {
                        isBoardExist.add(board["id"])
                        filtereBoard.push(board)
                    }
                }
                return filtereBoard
            })


            setLoading(false)

        } catch (error) {
            console.log(error)
        }
    }


    const handleFetchCardLists = async (boardId) => {

        if (fetchedBoardsFromDb.has(boardId)) {
            console.log("boardId already fetched", boardId)

            const existingCardLists = []

            for (const cardList of cardLists) {
                if (cardList["idBoard"] == boardId) {
                    existingCardLists.push(cardList)
                }
            }

            return existingCardLists

        }


        setFetchedBoardsFromDb(prev => {
            const updated = new Set(prev)
            updated.add(boardId)
            return updated
        })


        try {

            const response = await fetch(
                `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`
            )

            if (!response.ok) {
                throw new Error(`Trello error ${response.status}`)
            }

            const fetchedCardLists = await response.json()

            setCardLists((prev) => {
                const allCardLists = [...prev, ...fetchedCardLists]

                const filteredCardLists = []
                const isCardListExists = new Set()

                for (const board of allCardLists) {
                    if (!isCardListExists.has(board["id"])) {
                        isCardListExists.add(board["id"])
                        filteredCardLists.push(board)
                    }
                }
                return filteredCardLists
            }
            )

            return fetchedCardLists

        } catch (error) {
            console.log(error)
        }
    }


    const handleFetchCards = async (cardListId) => {

        if (fetchedCardListsFromDb.has(cardListId)) {

            const existingCards = []

            for (const card of cards) {
                if (card["idList"] == cardListId) {
                    existingCards.push(card)
                }
            }

            return existingCards
        }

        setFetchedCardListsFromDb((prev) => {
            const updatedSet = new Set(prev)
            updatedSet.add(cardListId)
            return updatedSet
        })


        try {
            const url = `https://api.trello.com/1/lists/${cardListId}/cards?key=${API_KEY}&token=${TOKEN}`
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`Trello error ${response.status}`)
            }

            const fetchedCards = await response.json()

            setCards((prev) => {
                const allCards = [...prev, ...fetchedCards]

                const filteredCards = []
                const isCardExist = new Set()

                for (const card of allCards) {
                    if (!isCardExist.has(card["id"])) {
                        isCardExist.add(card["id"])
                        filteredCards.push(card)
                    }
                }
                return filteredCards
            })

            return fetchedCards

        } catch (error) {
            console.log(error)
        }
    }


    async function handlePostNewCardList(name, boardId, setCardListLoading) {

        if (!name) {
            return
        }

        setCardListLoading(true)

        try {
            const url = new URL("https://api.trello.com/1/lists")

            url.searchParams.set("key", API_KEY)
            url.searchParams.set("token", TOKEN)
            url.searchParams.set("name", name)
            url.searchParams.set("idBoard", boardId)

            const response = await fetch(url, {
                method: "POST"
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const data = await response.json()

            setCardLists((prev) => {
                return [...prev, data]
            })

        } catch (error) {
            console.log(error)
        } finally {
            setCardListLoading(false)
        }
    }


    async function handleCreateCard(name, cardListId, setCardLoading) {

        setCardLoading(true)
        try {
            const url =
                `https://api.trello.com/1/cards` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}` +
                `&idList=${cardListId}` +
                `&name=${encodeURIComponent(name)}`

            const response = await fetch(url, {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const card = await response.json()

            setCards((prev) => [...prev, card])

        } catch (error) {
            console.log(error)
        } finally {
            setCardLoading(false)
        }

    }

    async function handleDeleteCardList(cardListId) {

        try {

            setCardLists((prev) => {
                return prev.filter((cardList) => {
                    return cardList["id"] != cardListId
                })
            })

            const url = `https://api.trello.com/1/lists/${cardListId}?key=${API_KEY}&token=${TOKEN}`

            const isCardListClosedData = await closeCardList(cardListId)
            const isCardListClosed = await isCardListClosedData

            if (!isCardListClosed["closed"]) {
                return
            }

            const response = await fetch(url, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(await response.text())
            }

        } catch (error) {
            console.log(error)
        }
    }


    async function closeCardList(cardIdList) {

        try {
            const url =
                `https://api.trello.com/1/lists/${cardIdList}` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}` +
                `&closed=true`

            const response = await fetch(url, {
                method: "PUT"
            });

            if (!response.ok) {
                throw new Error(await response.text())
            }

            return await response.json()

        } catch (error) {
            console.log(error)
        }
    }


    async function handleDeleteCard(cardId) {

        setCards((prev) => {
            return prev.filter((card) => {
                return card["id"] != cardId
            })
        })

        try {
            const url =
                `https://api.trello.com/1/cards/${cardId}` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}`

            const response = await fetch(url, {
                method: "DELETE"
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

        } catch (error) {
            console.log(error)
        }
    }


    async function handleRenameCardList(cardListId, newName) {

        setCardLists((prev) => {
            return prev.map((cardList) => {

                if (cardList["id"] == cardListId) {
                    cardList["name"] = newName
                }

                return cardList
            })
        })


        try {
            const url =
                `https://api.trello.com/1/lists/${cardListId}` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}` +
                `&name=${encodeURIComponent(newName)}`

            const response = await fetch(url, {
                method: "PUT"
            });

            if (!response.ok) {
                throw new Error(await response.text())
            }

        } catch (error) {
            console.log(error)
        }
    }


    async function handleRenameCard(cardId, newName) {


        setCards((prev) => {
            return prev.map((card) => {

                if (card["id"] == cardId) {
                    card["name"] = newName
                }

                return card
            })
        })

        try {
            const url =
                `https://api.trello.com/1/cards/${cardId}` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}` +
                `&name=${encodeURIComponent(newName)}`

            const response = await fetch(url, {
                method: "PUT"
            });

            if (!response.ok) {
                throw new Error(await response.text())
            }

        } catch (error) {
            console.log(error)
        }
    }



    // popup and its handlers


    async function handlePopUpData(cardId, name) {
        setCurrentPopCard({ cardId, name })

        if (fetchedCardsForPopUp[cardId]) {
            console.log("already fetched cardId", cardId)
            return fetchedCardsForPopUp[cardId]
        }

        try {
            const url = `https://api.trello.com/1/cards/${cardId}/checklists?checkItems=all&key=${API_KEY}&token=${TOKEN}`

            const response = await fetch(url)
            const data = await response.json()

            setFetchedCardsForPopUp((prev) => ({ ...prev, [cardId]: data }))
            return data

        } catch (error) {
            console.log(error)
        }
    }

    async function handleAddChecklist(cardId, checkListName, setIsCreatingChecklist) {

        console.log("called handleAddChecklist")

        try {
            console.log("called handleAddChecklist")
            const url =
                `https://api.trello.com/1/cards/${cardId}/checklists` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}` +
                `&name=${encodeURIComponent(checkListName)}`

            const response = await fetch(url, {
                method: "POST"
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const checkList = await response.json()
            setPopUpData((prev) => {
                return [...(prev || []), checkList]
            })


            setFetchedCardsForPopUp((prev) => {
                const updatedFetchedCardsForPopUp = { ...prev }
                const checklists = [...(updatedFetchedCardsForPopUp[cardId] || []), checkList]

                updatedFetchedCardsForPopUp[cardId] = checklists

                return updatedFetchedCardsForPopUp
            })

            setIsCreatingChecklist(false)

        } catch (error) {
            console.log(error)
        }


    }

    async function handleRenameChecklist(checkListId, newName, cardId) {

        setPopUpData((prev) => {

            return prev.map((checklist) => {

                if (checklist["id"] == checkListId) {
                    const updatedCheckList = { ...checklist }
                    updatedCheckList["name"] = newName
                    const checkItems = [...(checklist["checkItems"] || [])]
                    updatedCheckList["checkItems"] = checkItems

                    return updatedCheckList
                }

                return checklist
            })
        })

        // setFetchedCardsForPopUp
        // console.log(fetchedCardsForPopUp)
        setFetchedCardsForPopUp((prev) => {
            const updatedFetchedCardsPopUp = { ...prev }
            const checkLists = [...updatedFetchedCardsPopUp[cardId]]

            for (const checkList of checkLists) {
                if (checkList["id"] == checkListId) {
                    checkList["name"] = newName
                }
            }

            updatedFetchedCardsPopUp[cardId] = checkLists

            return updatedFetchedCardsPopUp
        })

        try {
            const url =
                `https://api.trello.com/1/checklists/${checkListId}` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}` +
                `&name=${encodeURIComponent(newName)}`

            const response = await fetch(url, {
                method: "PUT"
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            return await response.json()

        } catch (error) {
            console.log(error)
        }

    }

    async function handleDeleteChecklist(checklistId, cardId) {
        console.log("popUpData", popUpData)
        console.log("fetchedCardsForPopUp", fetchedCardsForPopUp)

        console.log("checklistId", checklistId)
        console.log("cardId", cardId)

        setPopUpData((prev) => {
            return prev.filter((checklist) => {
                return checklist["id"] != checklistId
            })
        })

        setFetchedCardsForPopUp((prev) => {
            const updatedFetchedCardsForPopUp = { ...prev }

            const updatedChecklists = [...updatedFetchedCardsForPopUp[cardId]]
                .filter((checklist) => {
                    return checklist["id"] != checklistId
                })

            updatedFetchedCardsForPopUp[cardId] = updatedChecklists

            return updatedFetchedCardsForPopUp
        })

        try {
            const url =
                `https://api.trello.com/1/checklists/${checklistId}` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}`

            const response = await fetch(url, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(await response.text())
            }

            return await response.json()
        } catch (error) {
            console.log(error)
        }
    }


    async function handleAddCheckItem(checkListId, name, setPostingNewCheckItem, cardId) {

        try {
            const url =
                `https://api.trello.com/1/checklists/${checkListId}/checkItems` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}` +
                `&name=${encodeURIComponent(name)}`

            const response = await fetch(url, {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const checkItem = await response.json()

            setPopUpData((prev) => {

                const updatedPopUpData = prev.map((checklist) => {

                    if (checklist["id"] == checkListId) {
                        return { ...checklist, ["checkItems"]: [...(checklist["checkItems"] || []), checkItem] }
                    }

                    return checklist
                })
                return updatedPopUpData
            })

            console.log("fetchedCardsForPopUp", fetchedCardsForPopUp)


            setFetchedCardsForPopUp((prev) => {
                const updatedFetchedCardsForPopUp = { ...prev }

                const checklists = [...updatedFetchedCardsForPopUp[cardId]]
                    .map((checklist) => {

                        if (checklist["id"] == checkListId) {
                            const checklistCheckItems = [...(checklist["checkItems"] || []), checkItem]

                            const updatedCheckList = { ...checklist }
                            updatedCheckList["checkItems"] = checklistCheckItems

                            return updatedCheckList
                        }

                        return checklist
                    })

                updatedFetchedCardsForPopUp[cardId] = checklists

                return updatedFetchedCardsForPopUp
            })

            setPostingNewCheckItem(false)

        } catch (error) {
            console.log(error)
        }

    }

    async function handleRenameCheckItem(cardId, checkItemId, newName, checkListId) {

        setPopUpData((prev) => {

            return prev.map((checklist) => {

                if (checklist["id"] == checkListId) {
                    const updatedCheckList = { ...checklist }
                    const checkItems = [...(checklist["checkItems"] || [])]

                    for (const checkItem of checkItems) {
                        if (checkItem["id"] == checkItemId) {
                            checkItem["name"] = newName
                        }
                    }

                    updatedCheckList["checkItems"] = checkItems
                    return updatedCheckList
                }

                return checklist
            })
        })


        console.log("calling renamecheckitem datastore fn with ", newName)

        try {
            const response = await fetch(
                `https://api.trello.com/1/cards/${cardId}/checkItem/${checkItemId}?name=${encodeURIComponent(newName)}&key=${API_KEY}&token=${TOKEN}`,
                {
                    method: "PUT"
                }
            )

            const data = await response.json()

        } catch (error) {
            console.log(error)
        }

    }

    async function handleDeleteCheckItem(cardId, checkListId, checkItemId) {

        setPopUpData((prev) => {

            const updatedPopUpData = prev.map((checklist) => {

                if (checklist["id"] == checkListId) {
                    const updatedChecklist = {...checklist}
                    const checkItems = updatedChecklist["checkItems"]
                        .filter((checkItem)=>{
                            return checkItem["id"] != checkItemId
                        })
                    
                    updatedChecklist["checkItems"] = checkItems

                    return updatedChecklist
                }

                return checklist
            })
            return updatedPopUpData
        })


        setFetchedCardsForPopUp((prev) => {
            const updatedFetchedCardsForPopUp = { ...prev }

            const checklists = [...updatedFetchedCardsForPopUp[cardId]]
                .map((checklist) => {

                    if (checklist["id"] == checkListId) {
                        const checklistCheckItems = [...checklist["checkItems"]]
                        .filter((checkItem)=>{
                            return checkItem["id"] != checkItemId
                        })

                        const updatedCheckList = { ...checklist }
                        updatedCheckList["checkItems"] = checklistCheckItems

                        return updatedCheckList
                    }

                    return checklist
                })

            updatedFetchedCardsForPopUp[cardId] = checklists

            return updatedFetchedCardsForPopUp
        })

        try {
            const url =
                `https://api.trello.com/1/cards/${cardId}/checkItem/${checkItemId}` +
                `?key=${API_KEY}` +
                `&token=${TOKEN}`

            const response = await fetch(url, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(await response.text())
            }

            return await response.json()

        } catch (error) {
            console.log(error)
        }

    }


    async function handleMarkCheckItem(cardId, checklistId, checkItemId, isChecked) {

        setPopUpData((prev) => {

            const updatedPopUpData = prev.map((checklist) => {

                if (checklist["id"] == checklistId) {
                    const upadateChecklist = { ...checklist }
                    const updatedCheckItems = [...checklist["checkItems"]]

                    for (const checkItem of updatedCheckItems) {
                        if (checkItem["id"] == checkItemId) {
                            checkItem["state"] = isChecked ? "complete" : "incomplete"
                        }
                    }

                    upadateChecklist["checkItems"] = updatedCheckItems
                }

                return checklist
            })
            return updatedPopUpData
        })


        try {
            const url = new URL(
                `https://api.trello.com/1/cards/${cardId}/checklist/${checklistId}/checkItem/${checkItemId}`
            );

            url.searchParams.set("key", API_KEY)
            url.searchParams.set("token", TOKEN)
            url.searchParams.set("state", isChecked ? "complete" : "incomplete")

            const response = await fetch(url, {
                method: "PUT"
            });

            if (!response.ok) {
                throw new Error(await response.text())
            }

            return await response.json()

        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        handleFetchAllBoards()
    }, [])

    // useEffect(() => {
    //     console.log("popUpData", popUpData)
    // }, [popUpData])


    const store = {
        boards,
        setBoards,

        cardLists,
        setCardLists,

        cards,
        setCards,

        checklists,
        setChecklists,

        checkItems,
        setCheckItems,

        loading,
        setLoading,

        handleFetchCardLists,

        handleFetchCards,

        handlePostNewCardList,
        handleDeleteCardList,

        handleCreateCard,
        handleDeleteCard,

        handleRenameCardList,

        handleRenameCard,

        openPopUp,
        setOpenPopUp,

        handlePopUpData,
        popUpData,
        setPopUpData,
        currentPopUpCard,
        setCurrentPopCard,

        handleAddChecklist,

        handleRenameChecklist,

        handleDeleteChecklist,

        handleAddCheckItem,

        handleRenameCheckItem,

        handleDeleteCheckItem,

        handleMarkCheckItem
    }

    return (
        <DataContext.Provider value={store}>
            {children}
        </DataContext.Provider>
    )
}

export { DataProvider, DataContext }