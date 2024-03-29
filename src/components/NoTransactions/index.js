import React from "react";
import "./styles.css"
import transactionImg from "../../assets/transactions.jpg"

const NoTransactions = ()=>{
   return (
    <div className="noTransactions">
        
        <img src={transactionImg}/>
        <p>"You have no transactions currently"</p>
       
    </div>
   )
}
 export default NoTransactions;