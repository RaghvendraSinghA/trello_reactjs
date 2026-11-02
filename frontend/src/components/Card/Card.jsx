import "./card.css"
import deleteIcon from "../../assets/delete.png"
import editIcon from "../../assets/edit.png"
import {useContext, useRef, useState, useEffect} from "react"
import {DataContext} from "../../context/DataStore.jsx"


function Card({ card }) {

    const {handleDeleteCard, handleRenameCard, setOpenPopUp, handlePopUpData, setPopUpData, loading, setLoading} = useContext(DataContext)
     const renameInput = useRef({})
    const [isEditing, setEditing] = useState(false)

    // if(!card){
    //     return <></>
    // }
    // console.log(card)
    // console.log(card["id"])

    // console.log("cardname", card["name"])

    const handleDeleteBtn = (event) => {
        event.stopPropagation()
        handleDeleteCard(card["id"])
    }

    const handleRenameClick = (event) =>{
        event.stopPropagation()
        setEditing(true)
    }

    const renameCurrCard = (event) =>{
    
        if(event.key == "Enter"){
            handleRenameCard(card["id"],renameInput.current.value)
            setEditing(false)
        }
    }

    const handleCardPopUpOpen = async (event) =>{
        setOpenPopUp(true)
        setLoading(true)
        const cardPopUpData = await handlePopUpData(card["id"], card["name"])
        // console.log("cardPopUpData", cardPopUpData)
        setPopUpData(cardPopUpData)
        setLoading(false)
    }

    useEffect(() => {
            if (isEditing && renameInput.current) {
                renameInput.current.focus()
            }
    }, [isEditing])

    return (
        <div className="card" onClick={(event)=>handleCardPopUpOpen(event)}>

            {isEditing ? <input ref={renameInput} className="card-name-input" placeholder="Enter new name" onKeyDown={renameCurrCard} defaultValue={card.name}/> : <div className="card-name">{card?.name}</div>}

            <div className="card-actions">
                <img className="edit-btn" src={editIcon} alt="edit_btn" onClick={(event)=>handleRenameClick(event)}/>
                <img className="delete-btn" src={deleteIcon} alt="delete-btn" onClick={(event)=>handleDeleteBtn(event)} />
            </div>
        </div>
    )
}

export { Card }