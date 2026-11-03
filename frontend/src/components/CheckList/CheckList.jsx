import editIcon from "../../assets/editWhite.png"
import deleteIcon from "../../assets/delete.png"
import "./checkList.css"
import { CheckItem } from "../CheckItem/CheckItem"
import { ProgressBar } from "../ProgressBar/ProgressBar.jsx"
import { useState, useContext, useRef, useEffect } from "react"
import { Spinner } from "../Spinner/Spinner.jsx"
import { DataContext } from "../../context/DataStore.jsx"


function CheckList(props) {

    const [openAddCheckItemInput, setOpenAddCheckItemInput] = useState(false)
    const [isPostingNewCheckItem, setPostingNewCheckItem] = useState(false)
    const { handleRenameChecklist, handleDeleteChecklist, handleAddCheckItem } = useContext(DataContext)

    const [isEditingCheckListName, setEditingCheckListName] = useState(false)
    const addCheckItemInput = useRef({})
    const renameCheckListInput = useRef({})

    // console.log("chekclistprops", props)
    const checkListName = props["checklist"]["name"]
    const checkListId = props["checklist"]["id"]
    const allCheckItems = props["checklist"]["checkItems"]

    const cardId = props["checklist"]["idCard"]
    // console.log("cardId",cardId)
    // console.log("allCheckItems", allCheckItems)

    // const addCheckItemInput = useRef({})


    const handleAddNewCheckItem = (event) => {
        setPostingNewCheckItem(true)
        handleAddCheckItem(checkListId, addCheckItemInput.current.value, setPostingNewCheckItem, cardId)
        addCheckItemInput.current.value = ""
    }

    const handleOnKeyDownOfAddNewCheckItemInput = (event) => {
        if (event.key == "Enter") {
            handleAddNewCheckItem()
        }
    }

    const handleRenameCheckListCurr = (event) => {
        if(event.key == "Enter"){
            const newName = renameCheckListInput.current.value
            handleRenameChecklist(checkListId, newName, cardId)
            renameCheckListInput.current.value=""
            setEditingCheckListName(false)
        }
    }

    const handleDeleteCurrentChecklist = (event) =>{
        handleDeleteChecklist(checkListId, cardId)
    }


    const numberOfCheckedItems = allCheckItems.reduce((accumluator, current) => {
        if (current["state"] == "complete") {
            return accumluator += 1
        }
        return accumluator
    }, 0)

    useEffect(() => {

        if (openAddCheckItemInput && addCheckItemInput.current) {
            addCheckItemInput.current.focus()
        }

    }, [openAddCheckItemInput])

     useEffect(() => {

        if (isEditingCheckListName && renameCheckListInput.current) {
            renameCheckListInput.current.focus()
        }

    }, [isEditingCheckListName])

    

    return (
        <div className="checklist">

            <div className="checklist-name-and-actions">

                {isEditingCheckListName ?
                    <input className="checklist-rename-input" defaultValue={checkListName} ref={renameCheckListInput} onKeyDown ={handleRenameCheckListCurr} />
                    :
                    <div className="checklist-name">{checkListName}</div>
                }

                <div className="checklist-actions">
                    <img className="checklist-edit" alt="edit" src={editIcon} onClick={()=>setEditingCheckListName((prev)=>!prev)} />
                    <img className="checklist-delete" alt="delete" src={deleteIcon} onClick={handleDeleteCurrentChecklist}/>
                </div>

            </div>

            <ProgressBar totalItems={allCheckItems.length} completedItems={numberOfCheckedItems} />


            {/* checkitem of checklist */}
            <div className="check-items-container">
                {allCheckItems.map((checkItem, index) => {
                    return <CheckItem key={index} checkItem={checkItem} cardId={cardId} />
                })}
            </div>


            {/* add new checkitem */}
            <div className="add-check-item-container">

                {openAddCheckItemInput == false ?
                    <div className="add-check-item-btn-initial" onClick={() => setOpenAddCheckItemInput(true)}>Add an item</div>
                    :
                    <div className="add-check-item-btn-while-adding">

                        <input ref={addCheckItemInput} className="add-check-item-input" placeholder="Add an item" onKeyDown={handleOnKeyDownOfAddNewCheckItemInput} />

                        <div className="add-check-item-actions">
                            {isPostingNewCheckItem == false ? <div className="add-check-item-btn" onClick={handleAddNewCheckItem}>Add</div>
                                :
                                <Spinner containerClassName="spinner-container" spinnerClassName="card-spinner" />
                            }
                            <div className="cancel-check-item-btn" onClick={() => setOpenAddCheckItemInput(false)}>Cancel</div>
                        </div>

                    </div>
                }


            </div>

        </div>
    )
}

export { CheckList }