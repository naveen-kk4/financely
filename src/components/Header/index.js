import React, { useEffect } from "react";
import './styles.css';
import{useAuthState} from "react-firebase-hooks/auth"
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from "../../assets/user.png"

const Header =()=>{
    const[user,loading] = useAuthState(auth);
   
    const navigate = useNavigate();

    useEffect(()=>{
     if(user)navigate("/dashboard");
    },[user,loading]);


    function logoutFn(){
     const res = prompt("If you are sure write yes");
     if(res.toLowerCase()==="yes"){
          signOut(auth).then(()=>{
            toast.success("Logged out successfully");
            navigate("/");

          }).catch((error)=>{
               toast.error(error.message);
          })
     }

    }
    return (
        <div className="navbar">
            <p className="logo">Financely.</p>
            <div className="logout-wrapper">
            {user && (user.photoURL!==null ? <img src={user.photoURL}></img>:<img src = {userImg}></img>)}
            
            {user && <p onClick={logoutFn} className="logout">Logout</p>}
            </div>
            
            </div>
    )
}
export default Header;