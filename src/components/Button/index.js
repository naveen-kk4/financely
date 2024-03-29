import React from "react";
import "./styles.css";
 const Button = ({text, onClickFn , blue ,type , disabled })=>{
    return (
         <button disabled={disabled} style={disabled?{opacity:"0.6"}:{opacity:"1.0"}}  type={type} className={blue?"btn blue":"btn" } onClick={onClickFn}>{text}</button>
    )
 }
  export default Button ;