import editIcon from "../../assets/editWhite.png"
import deleteIcon from "../../assets/delete.png"
import "./checkItem.css"
import { useContext, useState } from "react"
import { DataContext } from "../../context/DataStore.jsx"

function CheckItem(props) {

    const { handleRenameCheckItem, handleDeleteCheckItem, handleMarkCheckItem } = useContext(DataContext)
    // console.log("checkItemprops", props)

    const cardId = props["cardId"]
    const checkItemId = props["checkItem"]["id"]
    const checkItemName = props["checkItem"]["name"]
    const checkListId = props["checkItem"]["idChecklist"]


    // console.log("cardId",cardId)

    const [isChecked, setIsChecked] = useState(props["checkItem"]["state"] == "complete" ? true : false)


    const handleCheckBox = async (event) => {
        console.log("checkbox-event", event.target.checked)
        // cardId, checklistId, checkItemId, isChecked
        await handleMarkCheckItem(cardId, checkListId, checkItemId, event.target.checked)
    }


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
                <div className="check-item-name">{checkItemName ? checkItemName : Unnamed}</div>
            </div>


            <div className="check-item-actions">
                <img className="check-item-edit" src={editIcon} />
                <img className="check-item-delete" src={deleteIcon} />
            </div>

        </div>
    )
}


export { CheckItem }