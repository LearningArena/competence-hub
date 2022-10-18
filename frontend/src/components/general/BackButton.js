import React from 'react'
import { useHistory } from 'react-router-dom'

const BackButton = () => {
    let history = useHistory()

    return (
        <button onClick={history.goBack} className="button icon-only back-button">
            Tillbaka <span className="back-icon">&#8617;</span>
        </button>
    )
}

export default BackButton
