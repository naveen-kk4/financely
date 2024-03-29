import React from "react";
import './styles.css';

const Input = ({label,placeholder,state,setState,type})=>{
    return(
    <div className="input-wrapper">
    <label className="label" htmlFor={label}>{label}</label>
    <br></br>
    <input 
      className="input-tag"
      type={type} 
      id={label} 
      name={label}
      placeholder={placeholder}
      value={state}
      required
      onChange={(e)=>{setState(e.target.value)}}
    />
  </div>
    )
}
export default Input;