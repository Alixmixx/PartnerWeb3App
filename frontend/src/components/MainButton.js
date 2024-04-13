import React from "react";
import '../App.css';


export default function MainButton({
    onClick, disabled, label
}) {
    return (
        <button className="button" onClick={onClick} disabled={disabled}>
            <span>{label}</span>
        </button>
    )
}