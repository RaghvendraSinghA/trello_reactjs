import "./board.css"
import { Link } from "react-router"

import defaultBoardImg from "../../assets/default_board.jpg"


function Board({board}){
    return(
        <Link to="/board-detail" state = {{board}} className="board">

            <div className="img-container">
                <img className="board-img" src = {board.prefs.backgroundImage||defaultBoardImg} alt = "board_img"/>
            </div>

            <div className="board-name">{board.name}</div>

        </Link>
    )
}

export {Board}