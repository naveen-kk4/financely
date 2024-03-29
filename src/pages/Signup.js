import React from "react";
import Header from "../components/Header";
import SignupSignin from "../components/SignupSignin";
import "./styles.css"

const Signup =()=>{
    return (
        <div>
            <Header></Header>
            <div className="wrapper">
                <SignupSignin></SignupSignin>
            </div>
        </div>
    )
}
export default Signup;