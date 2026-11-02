import "./cardDetailPopUp.css"
import editIcon from "../../assets/editWhite.png"
import addPopUpCheckListBtn from "../../assets/plusWhite.png"
import closeIcon from "../../assets/cross.png"
import { CheckList } from "../CheckList/CheckList.jsx"
import { DataContext } from "../../context/DataStore.jsx"
import { useContext, useEffect, useState, useRef } from "react"
import { Spinner } from "../Spinner/Spinner.jsx"


function CardDetailPopUp() {
    const { setOpenPopUp, popUpData, handleAddChecklist, setPopUpData, currentPopUpCard, handleRenameCard, setCurrentPopCard, fetchedCardsForPopUp } = useContext(DataContext)
    console.log("popUpData", popUpData)
    // console.log("cardId", cardId)

    // console.log("currentPopUpCard", currentPopUpCard)

    const [isEditingCardName, setEditingCardName] = useState(false)
    const cardRenameInput = useRef({})
    const addNewCheckListInputBox = useRef({})
    const [isCreatingCheckList, setIsCreatingChecklist] = useState(false)




    const handleRenamePopUpCard = (event) => {
        const newName = cardRenameInput.current.value

        if (event.key == "Enter") {
            handleRenameCard(currentPopUpCard["cardId"], newName)
            cardRenameInput.current.value = ""
            setEditingCardName(false)
            setCurrentPopCard((prev) => ({ ...prev, name: newName }))
        }

    }

    const handleAddNewCheckList = () => {
        const name = addNewCheckListInputBox.current.value
        setIsCreatingChecklist(true)
        handleAddChecklist(currentPopUpCard["cardId"], name, setIsCreatingChecklist)
        addNewCheckListInputBox.current.value = ""
    }


    const handleKeyOnAddNewCheckListInputBox = (event) => {
        if (event.key == "Enter") {
            handleAddNewCheckList()
        }
    }




    useEffect(() => {

        return () => {
            setPopUpData([])
        }
    }, [])

    useEffect(() => {
        if (isEditingCardName && cardRenameInput.current) {
            cardRenameInput.current.focus()
        }
    }, [isEditingCardName])

    


    return (
        <div className="card-overlay">

            <div className="card-popup">

                <div className="card-popup-name-and-actions">

                    {isEditingCardName ?
                        <input className="rename-popup-card" defaultValue={currentPopUpCard["name"]} ref={cardRenameInput} onKeyDown={handleRenamePopUpCard} />
                        :
                        <div className="popup-card-name">{currentPopUpCard["name"]}</div>
                    }

                    <div className="edit-and-close-card-popup">
                        <img className="edit-popup-cardname" src={editIcon} alt="edit" onClick={() => setEditingCardName(true)} />
                        <img className="close-card-popup-btn" src={closeIcon} alt="closepopup" onClick={() => setOpenPopUp(false)} />
                    </div>

                </div>

                <div className="add-checklist">
                    {isCreatingCheckList ? <Spinner containerClassName="spinner-container" spinnerClassName="card-spinner" />
                        :
                        <img className="add-popup-checklist-btn" alt="add checklist btn" src={addPopUpCheckListBtn} onClick={handleAddNewCheckList} />
                    }

                    <input className="popup-add-checklist-input" placeholder="add a checklist" onKeyDown={handleKeyOnAddNewCheckListInputBox} ref={addNewCheckListInputBox} />
                </div>



                <div className="checklist-container">
                    {/* <CheckList />
                    <CheckList />
                    <CheckList />
                    <CheckList />
                    <CheckList />
                    <CheckList /> */}
                    {popUpData.map((checklist, index) => {
                        return <CheckList key={index} checklist={checklist} />
                    })}
                </div>

            </div>
        </div>
    )
}

export { CardDetailPopUp }