import "./progressBar.css"


function ProgressBar({ totalItems, completedItems }) {
    const progress = totalItems === 0 ? 0 : Math.ceil((completedItems / totalItems) * 100)

    return (
        <div className="progressbar-container">
            <div className="progress-count">{progress}%</div>
            <div className="progressbar-track">
                <div
                    className="progressbar-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}

export { ProgressBar }