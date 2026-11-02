import {useContext } from 'react'
import './App.css'
import { Navbar } from "./components/Navbar/Navbar.jsx"
import { Routes, Route } from "react-router"
import { Home } from "./pages/Home/Home.jsx"
import { BoardDetail } from "./pages/BoardDetail/BoardDetail.jsx"
import { DataContext} from "../src/context/DataStore.jsx"
import LoadingPopup from './components/LoadingPopUp/LoadingPopUp.jsx'
import {CardDetailPopUp} from "../src/components/CardDetailPopUp/CardDetailPopUp.jsx"


function App() {
  const { loading, openPopUp} = useContext(DataContext)
  return (
    <>
      {loading && <LoadingPopup />}
      {openPopUp && <CardDetailPopUp />}
      
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board-detail" element={<BoardDetail />} />
        </Routes>
    </>
  )
}

export default App
