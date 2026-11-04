import "./boardDetail.css"
import { CardList } from "../../components/CardList/CardList.jsx"
import { AddCardList } from "../../components/AddCardList/AddCardList.jsx"
import { useLocation } from "react-router"
import { useContext, useEffect, useState } from "react"
import { DataContext } from "../../context/DataStore.jsx"



function BoardDetail() {
    const { state } = useLocation()
    const board = state?.board
    //   console.log("board", board)
    //   console.log("board ID", board["id"])

    // console.log("board", board)


    const { handleFetchCardLists, cardLists} = useContext(DataContext)

    const [currBoardCardLists, setCardLists] = useState([])

    useEffect(() => {
        handleFetchCardLists(board["id"])
            .then((data) => {
                setCardLists(data)
            })
    }, [cardLists])


    return (
        <>
            <div className="board-detail-page-board-name">{board.name}</div>
            <div className="board-detail-page">

                {currBoardCardLists.map((cardList,index)=>{
                    return <CardList key={index} cardList={cardList}/>
                })}
                <AddCardList boardId = {board["id"]}/>
            </div>
        </>
    )
}


export { BoardDetail }