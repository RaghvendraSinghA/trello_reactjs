import "./home.css"
import {Board} from "../../components/Board/Board.jsx"
import {DataContext} from "../../context/DataStore.jsx"
import {useContext} from "react"

function Home() {

    const {boards} = useContext(DataContext)

    return (
            <div className="home-page">
                {boards.map((board, index)=><Board key={index} board={board}/>)}
            </div>
    )
}


export { Home }