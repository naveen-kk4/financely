import { Row, Card } from "antd";
import React from "react";
import "./styles.css"
import Button from "../Button";


const Cards = ({showExpenseModale, showIncomeModale , income, expense,balance,clearAll})=>{

    return(
        <div>
        <Row className="cards-wrapper">
            <Card className="my-card" title = "Current Balance">
                <p>₹{balance}</p>
                <Button onClickFn={clearAll}  text={"Reset Balance"} ></Button>
                </Card>
            <Card className="my-card" title = "Total Income"> <p>₹{income}</p>
                <Button  text={"Add Income"} onClickFn={showIncomeModale} ></Button></Card>
            <Card className="my-card" title = "Total Expenses"> <p>₹{expense}</p>
                <Button  text={"Add Expenses"} onClickFn={showExpenseModale} ></Button></Card>
        </Row>
        
        </div>
    )

}
export default Cards;