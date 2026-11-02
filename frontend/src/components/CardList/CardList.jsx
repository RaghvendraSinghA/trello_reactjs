import "./cardList.css"
import deleteIcon from "../../assets/delete.png"
import editIcon from "../../assets/edit.png"
import { Card } from "../Card/Card.jsx"
import addIcon from "../../assets/plus.png"
import { DataContext } from "../../context/DataStore.jsx"
import { useContext, useState, useEffect, useRef } from "react"
import { Spinner } from "../Spinner/Spinner.jsx"

function CardList({ cardList }) {
    // console.log("cardList", cardList)

    const { handleFetchCards, cards, handleCreateCard, handleDeleteCardList, handleRenameCardList } = useContext(DataContext)

    const [currentCardListCards, setCurrentCardListCards] = useState([])
    const inputBtn = useRef({})
    const renameInput = useRef({})
    const [isEditing, setEditing] = useState(false)
    const [isCardLoading, setCardLoading] = useState(false)

    useEffect(() => {
        const allCards = handleFetchCards(cardList["id"])

        allCards.then((data) => {
            setCurrentCardListCards(data)
        })

    }, [cards])


    const handleEnterKey = (event) => {

        if (event.key == "Enter") {
            handleCreateCard(inputBtn.current.value, cardList["id"], setCardLoading)
            inputBtn.current.value = ""
        }
    }

    const handleAddBtn = () => {
        handleCreateCard(inputBtn.current.value, cardList["id"], setCardLoading)
        inputBtn.current.value = ""
    }

    const handleDeleteBtn = () => {
        handleDeleteCardList(cardList["id"])
    }

    const handleRenameCurrCardList = (event) => {
        setEditing(true)
    }

    const handleRenameCurrCardListInput = (event) => {

        if (event.key == "Enter") {
            handleRenameCardList(cardList["id"], renameInput.current.value)
            setEditing(false)
        }
    }

    useEffect(() => {
        if (isEditing && renameInput.current) {
            renameInput.current.focus()
        }
    }, [isEditing])



    return (
        <>
            <div className="cardlist">

                <div className="cardlist-header">

                    {isEditing ? <input onKeyDown={handleRenameCurrCardListInput} defaultValue={cardList.name}
                        ref={renameInput} className="cardlist-name-input" placeholder="Enter new name" /> : <div className="cardlist-name">{cardList.name}</div>}

                    <div className="cardlist-actions">
                        <img className="edit-btn" src={editIcon} alt="edit_btn" onClick={handleRenameCurrCardList} />
                        <img className="delete-btn" src={deleteIcon} alt="delete-btn" onClick={() => handleDeleteBtn()} />
                    </div>

                </div>

                <div className="cards-container">

                    {currentCardListCards?.map((card, index) => {
                        return <Card key={index} card={card} />
                    })}

                </div>

                {/* <Spinner containerClassName="spinner-container" spinnerClassName="card-spinner"/> */}

                <div className="add-new-card">

                    {/* <img className="add-icon" alt="add-card" src={addIcon} onClick={() => handleAddBtn()} /> */}

                    {isCardLoading ? <Spinner containerClassName="spinner-container" spinnerClassName="card-spinner" />
                        : <img className="add-icon" alt="add-card" src={addIcon} onClick={() => handleAddBtn()} />
                    }

                    <input className="add-card-input" placeholder="Enter new card name" onKeyDown={() => handleEnterKey(event)} ref={inputBtn} />
                </div>

            </div>
        </>
    )
}

export { CardList }