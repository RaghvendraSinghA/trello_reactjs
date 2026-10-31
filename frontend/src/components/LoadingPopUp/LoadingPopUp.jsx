import "./loadingPopUp.css"

function LoadingPopup({ message = "Loading..." }) {
    return (
        <div className="loading-overlay">
            <div className="loading-box">
                <div className="spinner"></div>
            </div>
        </div>
    )
}

export default LoadingPopup