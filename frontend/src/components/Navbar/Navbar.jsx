import trelloLogo from "../../assets/trello_logo.png";
import "./navbar.css"
import { Link } from "react-router"

function Navbar (){

    return(
        <>
            <div className="navbar">
                <Link to = "/" className="logo-and-name">
                    <div className="logo">
                        <img className="logo-img" src={trelloLogo} alt="trello_logo" />
                    </div>

                    <div className="name" >
                        Trello
                    </div>
                </Link>
            </div>
        </>
    )
}


export {Navbar}