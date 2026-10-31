import addIcon from "../../assets/plus.png"
import "./addCardList.css"
import { DataContext } from "../../context/DataStore.jsx"
import { useContext, useRef, useState } from "react"
import { Spinner } from "../Spinner/Spinner.jsx"

function AddCardList({ boardId }) {
    const { handlePostNewCardList } = useContext(DataContext)
    const inputBtn = useRef({})
    const [isCardListLoading, setCardListLoading] = useState(false)

    const handleKeyDown = (event) => {
        if (event.key == "Enter") {
            handlePostNewCardList(inputBtn.current.value, boardId, setCardListLoading)
            inputBtn.current.value = ""
        }
    }

    const handleAddBtnCardList = () => {
        handlePostNewCardList(inputBtn.current.value, boardId, setCardListLoading)
        inputBtn.current.value = ""
    }
    return (
        <div className="add-cardlist">

            {isCardListLoading ? <Spinner containerClassName="big-spinner-container"  spinnerClassName="big-card-spinner" />
                :
            <>
             <input ref={inputBtn} onKeyDown={() => handleKeyDown(event)} className="add-cardlist-input" placeholder="Enter new cardlist name" />
             <img className="add-cardlist-btn" src={addIcon} alt="add_btn" onClick={() => handleAddBtnCardList()} />
            </>
            }
        </div>
    )
}

export { AddCardList }