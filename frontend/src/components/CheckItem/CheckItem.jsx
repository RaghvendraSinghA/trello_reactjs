import editIcon from "../../assets/editWhite.png"
import deleteIcon from "../../assets/delete.png"
import "./checkItem.css"
import { useContext, useState, useEffect, useRef } from "react"
import { DataContext } from "../../context/DataStore.jsx"

function CheckItem(props) {

    const { handleRenameCheckItem, handleDeleteCheckItem, handleMarkCheckItem } = useContext(DataContext)
    // console.log("checkItemprops", props)
    const [isChecked, setIsChecked] = useState(props["checkItem"]["state"] == "complete" ? true : false)

    const [isRenamingCheckItem, setRenamingCheckItem] = useState(false)
    const renamingCheckItemInput = useRef({})

    const cardId = props["cardId"]
    const checkItemId = props["checkItem"]["id"]
    const checkItemName = props["checkItem"]["name"]
    const checkListId = props["checkItem"]["idChecklist"]


    // console.log("cardId",cardId)


    const handleCheckBox = async (event) => {
        console.log("checkbox-event", event.target.checked)
        await handleMarkCheckItem(cardId, checkListId, checkItemId, event.target.checked)
    }


    const handleCurrentCheckItemRename = (event) =>{
        console.log(event.key)
        if(event.key == "Enter"){
            const newName = renamingCheckItemInput.current.value
            handleRenameCheckItem(cardId, checkItemId, newName, checkListId)
            renamingCheckItemInput.current.value = ""
            setRenamingCheckItem(false)

            console.log("calling renamecheckitem")
        }
    }

    const handleCurrentCheckItemDelete = (event) =>{
        handleDeleteCheckItem(cardId, checkListId, checkItemId)
    }


    useEffect(()=>{

        if(isRenamingCheckItem && renamingCheckItemInput.current){
            renamingCheckItemInput.current.focus()
        }

    }, [isRenamingCheckItem])


    return (
        <div className="check-item-name-and-actions">

            <div className={`checkbox-and-check-item-name ${isChecked && "check-item-strikethrough"}`}>
                <input className="check-item-checkbox" type="checkbox" checked={isChecked}
                    onChange={(event) => {
                        setIsChecked(event.target.checked)
                        handleCheckBox(event)
                    }
                    }
                />

                {isRenamingCheckItem ?
                    <input className="rename-checkItem-input" ref={renamingCheckItemInput} defaultValue={checkItemName} onKeyDown={handleCurrentCheckItemRename} />
                    :
                    <div className="check-item-name">{checkItemName}</div>
                }
        
            </div>


            <div className="check-item-actions">
                <img className="check-item-edit" src={editIcon} onClick={()=>setRenamingCheckItem((prev)=> !prev)}/>
                <img className="check-item-delete" src={deleteIcon} onClick={handleCurrentCheckItemDelete} />
            </div>

        </div>
    )
}


export { CheckItem }