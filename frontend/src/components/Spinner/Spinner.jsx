import "./spinner.css"

function Spinner({containerClassName, spinnerClassName}){
    return(
        <div className={containerClassName}>
            <div className={spinnerClassName}></div>
        </div>
    )
}

export {Spinner}