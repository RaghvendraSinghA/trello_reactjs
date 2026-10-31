import "./card.css"
import deleteIcon from "../../assets/delete.png"
import editIcon from "../../assets/edit.png"
import {useContext, useRef, useState, useEffect} from "react"
import {DataContext} from "../../context/DataStore.jsx"


function Card({ card }) {

    const {handleDeleteCard, handleRenameCard} = useContext(DataContext)
     const renameInput = useRef({})
    const [isEditing, setEditing] = useState(false)

    // if(!card){
    //     return <></>
    // }
    // console.log(card)
    // console.log(card["id"])

    const handleDeleteBtn = () => {
        handleDeleteCard(card["id"])
    }

    const handleRenameClick = () =>{
        setEditing(true)
    }

    const renameCurrCard = (event) =>{
        
        if(event.key == "Enter"){
            handleRenameCard(card["id"],renameInput.current.value)
            setEditing(false)
        }
    }

    useEffect(() => {
            if (isEditing && renameInput.current) {
                renameInput.current.focus()
            }
    }, [isEditing])

    return (
        <div className="card">
            {/* <div className="card-name">{card?.name}</div> */}

            {isEditing ? <input ref={renameInput} className="card-name-input" placeholder="Enter new name" onKeyDown={renameCurrCard} defaultValue={card.name}/> : <div className="card-name">{card?.name}</div>}

            <div className="card-actions">
                <img className="edit-btn" src={editIcon} alt="edit_btn" onClick={handleRenameClick}/>
                <img className="delete-btn" src={deleteIcon} alt="delete-btn" onClick={() => handleDeleteBtn()} />
            </div>
        </div>
    )
}

export { Card }